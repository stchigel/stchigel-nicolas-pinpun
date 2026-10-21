import { db } from '../db/iniciar.js';
import AdministradorGeneral from '../models/AdministradorGeneral.js';
import AdministradorSucursal from '../models/AdministradorSucursal.js';
import Repartidor from '../models/Repartidor.js';
import { hashContrasena } from '../utils/contrasenas.js';

/* El administrador general no tiene local; el de sucursal sí (`local` es el id del local) */
const aAdministrador = (fila) =>
    fila.local_id === null
        ? new AdministradorGeneral(fila.dni, fila.nombre, fila.apellido, fila.mail, fila.numero, fila.direccion, fila.contrasena)
        : new AdministradorSucursal(fila.dni, fila.nombre, fila.apellido, fila.mail, fila.numero, fila.direccion, fila.contrasena, fila.local_id);

const aRepartidor = (fila) =>
    new Repartidor(fila.id, fila.dni, fila.nombre, fila.apellido, fila.mail, fila.numero, fila.direccion, fila.contrasena, fila.local_id, Boolean(fila.activo));

/* Administradores y repartidores comparten el mail para entrar: se busca en las dos tablas */
const findByMail = (mail) => {
    const buscado = mail.trim().toLowerCase();

    const administrador = db.prepare('SELECT * FROM administradores WHERE lower(mail) = ?').get(buscado);
    if (administrador) return aAdministrador(administrador);

    const repartidor = db.prepare('SELECT * FROM repartidores WHERE lower(mail) = ?').get(buscado);
    return repartidor ? aRepartidor(repartidor) : null;
};

const findRepartidores = ({ localId } = {}) =>
    (localId === undefined
        ? db.prepare('SELECT * FROM repartidores ORDER BY id').all()
        : db.prepare('SELECT * FROM repartidores WHERE local_id = ? ORDER BY id').all(localId)
    ).map(aRepartidor);

const findRepartidorById = (id) => {
    const fila = db.prepare('SELECT * FROM repartidores WHERE id = ?').get(id);
    return fila ? aRepartidor(fila) : null;
};

const createRepartidor = ({ dni, nombre, apellido, mail, numero, contrasena, localId }) => {
    const { lastInsertRowid } = db
        .prepare('INSERT INTO repartidores (dni, nombre, apellido, mail, numero, direccion, contrasena, local_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(dni, nombre, apellido, mail, numero, '', hashContrasena(contrasena), localId);

    return findRepartidorById(Number(lastInsertRowid));
};

/* La contraseña solo cambia si llega una nueva */
const updateRepartidor = (id, { nombre, apellido, numero, activo, contrasena }) => {
    if (!findRepartidorById(id)) return null;

    db.prepare('UPDATE repartidores SET nombre = ?, apellido = ?, numero = ?, activo = ? WHERE id = ?').run(nombre, apellido, numero, activo ? 1 : 0, id);
    if (contrasena) db.prepare('UPDATE repartidores SET contrasena = ? WHERE id = ?').run(hashContrasena(contrasena), id);

    return findRepartidorById(id);
};

export default { findByMail, findRepartidores, findRepartidorById, createRepartidor, updateRepartidor };
