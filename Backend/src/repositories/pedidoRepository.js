import Pedido from '../models/Pedido.js';

const pedidos = [];

let nextId = 1;

/* Del más nuevo al más viejo; filtra por local, estado y/o repartidor */
const findAll = ({ localId, estado, repartidorId } = {}) =>
    pedidos
        .filter(
            (pedido) =>
                (localId === undefined || pedido.localId === localId) &&
                (estado === undefined || pedido.estado === estado) &&
                (repartidorId === undefined || pedido.repartidorId === repartidorId)
        )
        .sort((a, b) => b.fecha.localeCompare(a.fecha));

const findById = (id) => pedidos.find((pedido) => pedido.id === id) ?? null;

const findByCodigo = (codigo) => pedidos.find((pedido) => pedido.codigoSeguimiento === codigo) ?? null;

const create = (datos) => {
    const pedido = new Pedido({ id: nextId++, ...datos });
    pedidos.push(pedido);
    return pedido;
};

/* El motivo (por qué no se pudo entregar) queda anotado en el recorrido del pedido */
const cambiarEstado = (id, estado, fecha, motivo = '') => {
    const pedido = findById(id);
    if (!pedido) return null;

    pedido.estado = estado;
    pedido.historial.push(motivo ? { estado, fecha, motivo } : { estado, fecha });
    return pedido;
};

/* `repartidorId` en null deja el pedido sin repartidor */
const asignar = (id, repartidorId, fecha) => {
    const pedido = findById(id);
    if (!pedido) return null;

    pedido.repartidorId = repartidorId;
    pedido.asignadoEn = repartidorId === null ? null : fecha;
    return pedido;
};

const guardarDestino = (id, destino) => {
    const pedido = findById(id);
    if (pedido) pedido.destino = destino;
};

const marcarDestinoIntentado = (id) => {
    const pedido = findById(id);
    if (pedido) pedido.destinoIntentadoEn = Date.now();
};

export default { findAll, findById, findByCodigo, create, cambiarEstado, asignar, guardarDestino, marcarDestinoIntentado };
