import { db, transaccion } from '../db/iniciar.js';
import Pedido from '../models/Pedido.js';

const itemsDe = db.prepare(
    'SELECT producto_id, nombre, categoria, subcategoria, variante, precio, cantidad FROM pedido_items WHERE pedido_id = ? ORDER BY orden'
);
const historialDe = db.prepare('SELECT estado, fecha, motivo FROM pedido_historial WHERE pedido_id = ? ORDER BY orden');

/* Cuándo se intentó ubicar la dirección de cada pedido: solo sirve para no reintentar a cada rato, no se guarda */
const destinosIntentados = new Map();

const aPedido = (fila) => {
    const pedido = new Pedido({
        id: fila.id,
        fecha: fila.fecha,
        total: fila.total,
        tipo: fila.tipo,
        estado: fila.estado,
        localId: fila.local_id,
        cliente: { nombre: fila.cliente_nombre, telefono: fila.cliente_telefono },
        direccion: fila.direccion,
        items: itemsDe.all(fila.id).map((item) => ({
            productoId: item.producto_id,
            nombre: item.nombre,
            categoria: item.categoria,
            subcategoria: item.subcategoria,
            variante: item.variante,
            precio: item.precio,
            cantidad: item.cantidad
        })),
        historial: historialDe.all(fila.id).map(({ estado, fecha, motivo }) => (motivo ? { estado, fecha, motivo } : { estado, fecha })),
        repartidorId: fila.repartidor_id,
        asignadoEn: fila.asignado_en,
        codigoSeguimiento: fila.codigo_seguimiento,
        destino: fila.destino_latitud === null ? null : { latitud: fila.destino_latitud, longitud: fila.destino_longitud }
    });
    pedido.destinoIntentadoEn = destinosIntentados.get(fila.id) ?? null;

    return pedido;
};

/* Del más nuevo al más viejo; filtra por local, estado y/o repartidor */
const findAll = ({ localId, estado, repartidorId } = {}) => {
    const condiciones = [];
    const valores = [];

    if (localId !== undefined) {
        condiciones.push('local_id = ?');
        valores.push(localId);
    }
    if (estado !== undefined) {
        condiciones.push('estado = ?');
        valores.push(estado);
    }
    if (repartidorId !== undefined) {
        condiciones.push('repartidor_id = ?');
        valores.push(repartidorId);
    }

    const donde = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

    return db
        .prepare(`SELECT * FROM pedidos ${donde} ORDER BY fecha DESC, id ASC`)
        .all(...valores)
        .map(aPedido);
};

const findById = (id) => {
    const fila = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(id);
    return fila ? aPedido(fila) : null;
};

const findByCodigo = (codigo) => {
    const fila = db.prepare('SELECT * FROM pedidos WHERE codigo_seguimiento = ?').get(codigo);
    return fila ? aPedido(fila) : null;
};

/* El modelo completa lo que falta (el recorrido inicial y el código de seguimiento); el pedido, sus renglones y su recorrido se guardan juntos */
const create = (datos) => {
    const pedido = new Pedido({ id: 0, ...datos });

    return transaccion(() => {
        const id = Number(
            db
                .prepare(
                    `INSERT INTO pedidos (fecha, total, tipo, estado, local_id, cliente_nombre, cliente_telefono, direccion, repartidor_id, asignado_en, codigo_seguimiento, destino_latitud, destino_longitud)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                )
                .run(
                    pedido.fecha,
                    pedido.total,
                    pedido.tipo,
                    pedido.estado,
                    pedido.localId,
                    pedido.cliente.nombre,
                    pedido.cliente.telefono,
                    pedido.direccion,
                    pedido.repartidorId,
                    pedido.asignadoEn,
                    pedido.codigoSeguimiento,
                    pedido.destino?.latitud ?? null,
                    pedido.destino?.longitud ?? null
                ).lastInsertRowid
        );

        const insertarItem = db.prepare(
            'INSERT INTO pedido_items (pedido_id, orden, producto_id, nombre, categoria, subcategoria, variante, precio, cantidad) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        pedido.items.forEach((item, orden) =>
            insertarItem.run(id, orden, item.productoId, item.nombre, item.categoria, item.subcategoria ?? '', item.variante ?? '', item.precio, item.cantidad)
        );

        const insertarPaso = db.prepare('INSERT INTO pedido_historial (pedido_id, orden, estado, fecha, motivo) VALUES (?, ?, ?, ?, ?)');
        pedido.historial.forEach((paso, orden) => insertarPaso.run(id, orden, paso.estado, paso.fecha, paso.motivo ?? ''));

        return findById(id);
    });
};

/* El motivo (por qué no se pudo entregar) queda anotado en el recorrido del pedido */
const cambiarEstado = (id, estado, fecha, motivo = '') => {
    if (!findById(id)) return null;

    return transaccion(() => {
        db.prepare('UPDATE pedidos SET estado = ? WHERE id = ?').run(estado, id);

        const { siguiente } = db.prepare('SELECT COALESCE(MAX(orden), -1) + 1 AS siguiente FROM pedido_historial WHERE pedido_id = ?').get(id);
        db.prepare('INSERT INTO pedido_historial (pedido_id, orden, estado, fecha, motivo) VALUES (?, ?, ?, ?, ?)').run(id, siguiente, estado, fecha, motivo);

        return findById(id);
    });
};

/* `repartidorId` en null deja el pedido sin repartidor */
const asignar = (id, repartidorId, fecha) => {
    if (!findById(id)) return null;

    db.prepare('UPDATE pedidos SET repartidor_id = ?, asignado_en = ? WHERE id = ?').run(repartidorId, repartidorId === null ? null : fecha, id);
    return findById(id);
};

const guardarDestino = (id, destino) => {
    db.prepare('UPDATE pedidos SET destino_latitud = ?, destino_longitud = ? WHERE id = ?').run(destino.latitud, destino.longitud, id);
};

const marcarDestinoIntentado = (id) => {
    destinosIntentados.set(id, Date.now());
};

export default { findAll, findById, findByCodigo, create, cambiarEstado, asignar, guardarDestino, marcarDestinoIntentado };
