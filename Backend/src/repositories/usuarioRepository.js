import { randomBytes, scryptSync } from 'node:crypto';
import AdministradorGeneral from '../models/AdministradorGeneral.js';
import AdministradorSucursal from '../models/AdministradorSucursal.js';
import Repartidor from '../models/Repartidor.js';

/* La contraseña se guarda como "sal:hash" (scrypt), nunca en texto plano */
export const hashContrasena = (contrasena) => {
    const sal = randomBytes(16).toString('hex');
    return `${sal}:${scryptSync(contrasena, sal, 32).toString('hex')}`;
};

/*
 * Cuentas de prueba (ver README):
 * - el administrador general gestiona todas las sucursales;
 * - cada administrador de sucursal gestiona solo la suya (`local` es el id del local);
 * - cada repartidor pertenece a una sucursal y ve solo los pedidos que le asignaron.
 */
const usuarios = [
    new AdministradorGeneral('30111222', 'Marta', 'Ferrari', 'admin@pinpun.com', '011 4862-3260', 'Av. Corrientes 3954', hashContrasena('pinpun2026')),
    new AdministradorSucursal('32333444', 'Raúl', 'Bianchi', 'almagro@pinpun.com', '011 4862-3260', 'Av. Corrientes 3954', hashContrasena('almagro2026'), 1),
    new AdministradorSucursal('33444555', 'Lucía', 'Conti', 'urquiza@pinpun.com', '011 4521-2181', 'La Pampa 5201', hashContrasena('urquiza2026'), 3),
    new Repartidor(1, '35111222', 'Diego', 'Paredes', 'diego@pinpun.com', '011 5611-2034', 'Medrano 1200', hashContrasena('reparto2026'), 1),
    new Repartidor(2, '36222333', 'Nahuel', 'Ortiz', 'nahuel@pinpun.com', '011 5877-4410', 'Gascón 640', hashContrasena('reparto2026'), 1),
    new Repartidor(3, '37333444', 'Verónica', 'Salas', 'vero@pinpun.com', '011 6034-9921', 'Triunvirato 4200', hashContrasena('reparto2026'), 3)
];

let nextRepartidorId = 4;

const esRepartidor = (usuario) => usuario instanceof Repartidor;

const findByMail = (mail) => usuarios.find((usuario) => usuario.mail === mail.trim().toLowerCase()) ?? null;

const findRepartidores = ({ localId } = {}) =>
    usuarios.filter((usuario) => esRepartidor(usuario) && (localId === undefined || usuario.local === localId));

const findRepartidorById = (id) => usuarios.find((usuario) => esRepartidor(usuario) && usuario.id === id) ?? null;

const createRepartidor = ({ dni, nombre, apellido, mail, numero, contrasena, localId }) => {
    const repartidor = new Repartidor(nextRepartidorId++, dni, nombre, apellido, mail, numero, '', hashContrasena(contrasena), localId);
    usuarios.push(repartidor);
    return repartidor;
};

/* La contraseña solo cambia si llega una nueva */
const updateRepartidor = (id, { nombre, apellido, numero, activo, contrasena }) => {
    const repartidor = findRepartidorById(id);
    if (!repartidor) return null;

    Object.assign(repartidor, { nombre, apellido, numero, activo });
    if (contrasena) repartidor.contrasena = hashContrasena(contrasena);
    return repartidor;
};

export default { findByMail, findRepartidores, findRepartidorById, createRepartidor, updateRepartidor };
