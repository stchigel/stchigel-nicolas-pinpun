import Reserva from '../models/Reserva.js';

const reservas = [];

let nextId = 1;

/* De la más próxima a la más lejana; filtra por local y/o estado */
const findAll = ({ localId, estado } = {}) =>
    reservas
        .filter((reserva) => (localId === undefined || reserva.localId === localId) && (estado === undefined || reserva.estado === estado))
        .sort((a, b) => a.fechaHora.localeCompare(b.fechaHora));

const findById = (id) => reservas.find((reserva) => reserva.id === id) ?? null;

const create = (datos) => {
    const reserva = new Reserva({ id: nextId++, ...datos });
    reservas.push(reserva);
    return reserva;
};

const cambiarEstado = (id, estado) => {
    const reserva = findById(id);
    if (!reserva) return null;

    reserva.estado = estado;
    return reserva;
};

export default { findAll, findById, create, cambiarEstado };
