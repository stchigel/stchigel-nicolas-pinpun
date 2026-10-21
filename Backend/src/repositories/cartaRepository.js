import { db, transaccion } from '../db/iniciar.js';

const usosDe = db.prepare('SELECT local_id, canal FROM local_cartas WHERE carta_id = ? ORDER BY local_id, canal');
const cantidadDe = db.prepare('SELECT COUNT(*) AS cantidad FROM productos WHERE carta_id = ?');

/* Una carta con cuántos platos tiene y en qué locales y canales se usa */
const aCarta = (fila) => ({
    id: fila.id,
    nombre: fila.nombre,
    cantidadProductos: cantidadDe.get(fila.id).cantidad,
    usos: usosDe.all(fila.id).map(({ local_id: localId, canal }) => ({ localId, canal }))
});

const findAll = () =>
    db
        .prepare('SELECT id, nombre FROM cartas ORDER BY id')
        .all()
        .map(aCarta);

const findById = (id) => {
    const fila = db.prepare('SELECT id, nombre FROM cartas WHERE id = ?').get(id);
    return fila ? aCarta(fila) : null;
};

/* La carta que se muestra cuando nadie dice de qué local es: la primera que se creó */
const predeterminada = () => {
    const fila = db.prepare('SELECT id, nombre FROM cartas ORDER BY id LIMIT 1').get();
    return fila ? aCarta(fila) : null;
};

/* La carta que usa un local en un canal ('salon', 'retiro' o 'delivery'), o null */
const deLocal = (localId, canal) => {
    const fila = db.prepare('SELECT carta_id FROM local_cartas WHERE local_id = ? AND canal = ?').get(localId, canal);
    return fila ? findById(fila.carta_id) : null;
};

const findByNombre = (nombre) =>
    findAll().find((carta) => carta.nombre.toLowerCase() === nombre.trim().toLowerCase()) ?? null;

const create = (nombre) => findById(Number(db.prepare('INSERT INTO cartas (nombre) VALUES (?)').run(nombre).lastInsertRowid));

/* Una carta nueva con una copia de todos los platos (y sus tamaños) de otra: así se arma "la de delivery" sin cargar todo de nuevo */
const duplicar = (origenId, nombre) =>
    transaccion(() => {
        const nueva = Number(db.prepare('INSERT INTO cartas (nombre) VALUES (?)').run(nombre).lastInsertRowid);
        const platos = db.prepare('SELECT * FROM productos WHERE carta_id = ? ORDER BY id').all(origenId);
        const insertarPlato = db.prepare(
            'INSERT INTO productos (carta_id, nombre, categoria, subcategoria, imagen, precio, descripcion, destacado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        const tamanos = db.prepare('SELECT orden, nombre, precio FROM producto_variantes WHERE producto_id = ? ORDER BY orden');
        const insertarTamano = db.prepare('INSERT INTO producto_variantes (producto_id, orden, nombre, precio) VALUES (?, ?, ?, ?)');

        for (const plato of platos) {
            const copia = Number(
                insertarPlato.run(nueva, plato.nombre, plato.categoria, plato.subcategoria, plato.imagen, plato.precio, plato.descripcion, plato.destacado).lastInsertRowid
            );
            for (const tamano of tamanos.all(plato.id)) insertarTamano.run(copia, tamano.orden, tamano.nombre, tamano.precio);
        }

        return findById(nueva);
    });

const renombrar = (id, nombre) => {
    db.prepare('UPDATE cartas SET nombre = ? WHERE id = ?').run(nombre, id);
    return findById(id);
};

/* Borra la carta y todos sus platos; el servicio se asegura antes de que no la use ningún local */
const remove = (id) => {
    const carta = findById(id);
    if (carta) db.prepare('DELETE FROM cartas WHERE id = ?').run(id);
    return carta;
};

export default { findAll, findById, predeterminada, deLocal, findByNombre, create, duplicar, renombrar, remove };
