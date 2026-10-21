import { db, transaccion } from '../db/iniciar.js';
import Local from '../models/Local.js';

const mesasDe = db.prepare('SELECT capacidad, cantidad FROM local_mesas WHERE local_id = ? ORDER BY capacidad');
const cartasDe = db.prepare('SELECT canal, carta_id FROM local_cartas WHERE local_id = ?');

const aLocal = (fila) =>
    new Local(
        fila.id,
        fila.nombre,
        fila.direccion,
        fila.numero,
        fila.instagram,
        fila.latitud,
        fila.longitud,
        fila.horario_apertura,
        fila.horario_cierre,
        mesasDe.all(fila.id).map(({ capacidad, cantidad }) => ({ capacidad, cantidad })),
        fila.reserva_max_personas,
        Boolean(fila.juntar_mesas),
        Object.fromEntries(cartasDe.all(fila.id).map(({ canal, carta_id: cartaId }) => [canal, cartaId]))
    );

const findAll = () =>
    db
        .prepare('SELECT * FROM locales ORDER BY id')
        .all()
        .map(aLocal);

const findById = (id) => {
    const fila = db.prepare('SELECT * FROM locales WHERE id = ?').get(id);
    return fila ? aLocal(fila) : null;
};

/* Solo cambian los datos que administra la sucursal; nombre, dirección y ubicación son su identidad */
const update = (id, { numero, horarioApertura, horarioCierre, mesas, reservaMaxPersonas, juntarMesas }) => {
    if (!findById(id)) return null;

    transaccion(() => {
        db.prepare(
            'UPDATE locales SET numero = ?, horario_apertura = ?, horario_cierre = ?, reserva_max_personas = ?, juntar_mesas = ? WHERE id = ?'
        ).run(numero, horarioApertura, horarioCierre, reservaMaxPersonas, juntarMesas ? 1 : 0, id);

        db.prepare('DELETE FROM local_mesas WHERE local_id = ?').run(id);
        const insertar = db.prepare('INSERT INTO local_mesas (local_id, capacidad, cantidad) VALUES (?, ?, ?)');
        for (const mesa of mesas) insertar.run(id, mesa.capacidad, mesa.cantidad);
    });

    return findById(id);
};

/* Asigna la carta de cada canal indicado ({ salon: 2, delivery: 3 }); los canales que no vienen quedan como estaban */
const asignarCartas = (id, cartas) => {
    transaccion(() => {
        const asignar = db.prepare(
            'INSERT INTO local_cartas (local_id, canal, carta_id) VALUES (?, ?, ?) ON CONFLICT (local_id, canal) DO UPDATE SET carta_id = excluded.carta_id'
        );
        for (const [canal, cartaId] of Object.entries(cartas)) asignar.run(id, canal, cartaId);
    });

    return findById(id);
};

export default { findAll, findById, update, asignarCartas };
