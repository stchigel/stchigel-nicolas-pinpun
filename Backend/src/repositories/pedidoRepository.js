import Pedido from '../models/Pedido.js';

const pedidos = [];

let nextId = 1;

/* Del más nuevo al más viejo; filtra por local y/o estado */
const findAll = ({ localId, estado } = {}) =>
    pedidos
        .filter((pedido) => (localId === undefined || pedido.localId === localId) && (estado === undefined || pedido.estado === estado))
        .sort((a, b) => b.fecha.localeCompare(a.fecha));

const findById = (id) => pedidos.find((pedido) => pedido.id === id) ?? null;

const create = (datos) => {
    const pedido = new Pedido({ id: nextId++, ...datos });
    pedidos.push(pedido);
    return pedido;
};

const cambiarEstado = (id, estado, fecha) => {
    const pedido = findById(id);
    if (!pedido) return null;

    pedido.estado = estado;
    pedido.historial.push({ estado, fecha });
    return pedido;
};

export default { findAll, findById, create, cambiarEstado };
