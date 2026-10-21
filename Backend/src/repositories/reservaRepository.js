import { db } from '../db/iniciar.js';
import Reserva from '../models/Reserva.js';

const aReserva = (fila) =>
    new Reserva({
        id: fila.id,
        fechaHora: fila.fecha_hora,
        cantPersonas: fila.cant_personas,
        estado: fila.estado,
        localId: fila.local_id,
        cliente: { nombre: fila.cliente_nombre, telefono: fila.cliente_telefono },
        aclaraciones: fila.aclaraciones,
        creada: fila.creada
    });

/* De la más próxima a la más lejana; filtra por local y/o estado */
const findAll = ({ localId, estado } = {}) => {
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

    const donde = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

    return db
        .prepare(`SELECT * FROM reservas ${donde} ORDER BY fecha_hora ASC, id ASC`)
        .all(...valores)
        .map(aReserva);
};

const findById = (id) => {
    const fila = db.prepare('SELECT * FROM reservas WHERE id = ?').get(id);
    return fila ? aReserva(fila) : null;
};

const create = ({ fechaHora, cantPersonas, estado, localId, cliente, aclaraciones = '', creada }) => {
    const { lastInsertRowid } = db
        .prepare(
            `INSERT INTO reservas (fecha_hora, cant_personas, estado, local_id, cliente_nombre, cliente_telefono, aclaraciones, creada)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(fechaHora, cantPersonas, estado, localId, cliente.nombre, cliente.telefono, aclaraciones, creada);

    return findById(Number(lastInsertRowid));
};

const cambiarEstado = (id, estado) => {
    if (!findById(id)) return null;

    db.prepare('UPDATE reservas SET estado = ? WHERE id = ?').run(estado, id);
    return findById(id);
};

export default { findAll, findById, create, cambiarEstado };
