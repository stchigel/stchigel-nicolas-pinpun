import { db, transaccion } from '../db/iniciar.js';
import Producto from '../models/Producto.js';

const variantesDe = db.prepare('SELECT nombre, precio FROM producto_variantes WHERE producto_id = ? ORDER BY orden');

/* De qué se compone un combo, con lo que cuesta cada componente por separado (el de su tamaño, si lo tiene), en el orden en que se cargaron */
const componentesDe = db.prepare(
    `SELECT c.componente_id AS productoId, p.nombre, c.variante, c.cantidad,
            COALESCE((SELECT v.precio FROM producto_variantes v WHERE v.producto_id = p.id AND v.nombre = c.variante), p.precio) AS precio
     FROM combo_componentes c JOIN productos p ON p.id = c.componente_id
     WHERE c.combo_id = ? ORDER BY c.rowid`
);

const aProducto = (fila) =>
    new Producto({
        id: fila.id,
        cartaId: fila.carta_id,
        nombre: fila.nombre,
        categoria: fila.categoria,
        subcategoria: fila.subcategoria,
        imagen: fila.imagen,
        precio: fila.precio,
        variantes: variantesDe.all(fila.id).map(({ nombre, precio }) => ({ nombre, precio })),
        descripcion: fila.descripcion,
        destacado: Boolean(fila.destacado),
        tipo: fila.tipo,
        componentes:
            fila.tipo === 'combo'
                ? componentesDe.all(fila.id).map(({ productoId, nombre, variante, cantidad, precio }) => ({ productoId, nombre, variante, cantidad, precio }))
                : []
    });

const mismoTexto = (a = '', b = '') => a.toLowerCase() === b.toLowerCase();

/* Los platos de una carta (o de todas, sin `cartaId`), con filtros opcionales por categoría, destacado y tipo; en el orden en que se cargaron */
const findAll = ({ categoria, destacado, cartaId, tipo } = {}) =>
    (cartaId === undefined
        ? db.prepare('SELECT * FROM productos ORDER BY id').all()
        : db.prepare('SELECT * FROM productos WHERE carta_id = ? ORDER BY id').all(cartaId)
    )
        .map(aProducto)
        .filter(
            (producto) =>
                (categoria === undefined || mismoTexto(producto.categoria, categoria)) &&
                (destacado === undefined || producto.destacado === destacado) &&
                (tipo === undefined || producto.tipo === tipo)
        );

const findById = (id) => {
    const fila = db.prepare('SELECT * FROM productos WHERE id = ?').get(id);
    return fila ? aProducto(fila) : null;
};

/* El nombre se repite entre secciones ("Carne" al horno y frita) y entre cartas, así que se busca dentro de la misma sección de la misma carta */
const findByNombre = ({ nombre, categoria, subcategoria, cartaId }) =>
    findAll({ cartaId }).find(
        (producto) =>
            mismoTexto(producto.nombre, nombre) &&
            mismoTexto(producto.categoria, categoria) &&
            mismoTexto(producto.subcategoria, subcategoria)
    ) ?? null;

const guardarVariantes = (id, variantes) => {
    db.prepare('DELETE FROM producto_variantes WHERE producto_id = ?').run(id);
    const insertar = db.prepare('INSERT INTO producto_variantes (producto_id, orden, nombre, precio) VALUES (?, ?, ?, ?)');
    variantes.forEach((variante, orden) => insertar.run(id, orden, variante.nombre, variante.precio));
};

/* Los componentes de un combo se reemplazan enteros; un plato simple no tiene */
const guardarComponentes = (id, tipo, componentes = []) => {
    db.prepare('DELETE FROM combo_componentes WHERE combo_id = ?').run(id);
    if (tipo !== 'combo') return;

    const insertar = db.prepare('INSERT INTO combo_componentes (combo_id, componente_id, variante, cantidad) VALUES (?, ?, ?, ?)');
    componentes.forEach((componente) => insertar.run(id, componente.productoId, componente.variante ?? '', componente.cantidad));
};

/* Los combos que usan un plato, y con qué tamaño: para no dejar un combo apuntando a algo que ya no está */
const usosEnCombos = (productoId) =>
    db
        .prepare(
            `SELECT c.combo_id AS comboId, p.nombre, c.variante
             FROM combo_componentes c JOIN productos p ON p.id = c.combo_id
             WHERE c.componente_id = ? ORDER BY c.combo_id`
        )
        .all(productoId)
        .map(({ comboId, nombre, variante }) => ({ comboId, nombre, variante }));

const create = ({ cartaId, nombre, categoria, subcategoria, imagen, precio, variantes, descripcion, destacado, tipo = 'simple', componentes = [] }) =>
    transaccion(() => {
        const id = Number(
            db
                .prepare('INSERT INTO productos (carta_id, nombre, categoria, subcategoria, imagen, precio, descripcion, destacado, tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
                .run(cartaId, nombre, categoria, subcategoria, imagen, precio, descripcion, destacado ? 1 : 0, tipo).lastInsertRowid
        );
        guardarVariantes(id, variantes);
        guardarComponentes(id, tipo, componentes);

        return findById(id);
    });

/* Reemplaza el plato conservando su id y su carta */
const update = (id, { nombre, categoria, subcategoria, imagen, precio, variantes, descripcion, destacado, tipo = 'simple', componentes = [] }) => {
    if (!findById(id)) return null;

    return transaccion(() => {
        db.prepare('UPDATE productos SET nombre = ?, categoria = ?, subcategoria = ?, imagen = ?, precio = ?, descripcion = ?, destacado = ?, tipo = ? WHERE id = ?').run(
            nombre,
            categoria,
            subcategoria,
            imagen,
            precio,
            descripcion,
            destacado ? 1 : 0,
            tipo,
            id
        );
        guardarVariantes(id, variantes);
        guardarComponentes(id, tipo, componentes);

        return findById(id);
    });
};

const remove = (id) => {
    const producto = findById(id);
    if (producto) db.prepare('DELETE FROM productos WHERE id = ?').run(id);
    return producto;
};

export default { findAll, findById, findByNombre, create, update, remove, usosEnCombos };
