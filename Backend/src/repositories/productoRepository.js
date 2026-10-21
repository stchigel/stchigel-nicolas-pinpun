import { db, transaccion } from '../db/iniciar.js';
import Producto from '../models/Producto.js';

const variantesDe = db.prepare('SELECT nombre, precio FROM producto_variantes WHERE producto_id = ? ORDER BY orden');

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
        destacado: Boolean(fila.destacado)
    });

const mismoTexto = (a = '', b = '') => a.toLowerCase() === b.toLowerCase();

/* Los platos de una carta (o de todas, sin `cartaId`), con filtros opcionales por categoría y por destacado; en el orden en que se cargaron */
const findAll = ({ categoria, destacado, cartaId } = {}) =>
    (cartaId === undefined
        ? db.prepare('SELECT * FROM productos ORDER BY id').all()
        : db.prepare('SELECT * FROM productos WHERE carta_id = ? ORDER BY id').all(cartaId)
    )
        .map(aProducto)
        .filter(
            (producto) =>
                (categoria === undefined || mismoTexto(producto.categoria, categoria)) &&
                (destacado === undefined || producto.destacado === destacado)
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

const create = ({ cartaId, nombre, categoria, subcategoria, imagen, precio, variantes, descripcion, destacado }) =>
    transaccion(() => {
        const id = Number(
            db
                .prepare('INSERT INTO productos (carta_id, nombre, categoria, subcategoria, imagen, precio, descripcion, destacado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
                .run(cartaId, nombre, categoria, subcategoria, imagen, precio, descripcion, destacado ? 1 : 0).lastInsertRowid
        );
        guardarVariantes(id, variantes);

        return findById(id);
    });

/* Reemplaza el plato conservando su id y su carta */
const update = (id, { nombre, categoria, subcategoria, imagen, precio, variantes, descripcion, destacado }) => {
    if (!findById(id)) return null;

    return transaccion(() => {
        db.prepare('UPDATE productos SET nombre = ?, categoria = ?, subcategoria = ?, imagen = ?, precio = ?, descripcion = ?, destacado = ? WHERE id = ?').run(
            nombre,
            categoria,
            subcategoria,
            imagen,
            precio,
            descripcion,
            destacado ? 1 : 0,
            id
        );
        guardarVariantes(id, variantes);

        return findById(id);
    });
};

const remove = (id) => {
    const producto = findById(id);
    if (producto) db.prepare('DELETE FROM productos WHERE id = ?').run(id);
    return producto;
};

export default { findAll, findById, findByNombre, create, update, remove };
