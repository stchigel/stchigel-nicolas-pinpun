import { randomBytes, scryptSync } from 'node:crypto';
import AdministradorGeneral from '../models/AdministradorGeneral.js';
import AdministradorSucursal from '../models/AdministradorSucursal.js';

/* La contraseña se guarda como "sal:hash" (scrypt), nunca en texto plano */
export const hashContrasena = (contrasena) => {
    const sal = randomBytes(16).toString('hex');
    return `${sal}:${scryptSync(contrasena, sal, 32).toString('hex')}`;
};

/*
 * Cuentas de prueba del panel de administración (ver README):
 * - el administrador general gestiona todas las sucursales;
 * - cada administrador de sucursal gestiona solo la suya (`local` es el id del local).
 */
const usuarios = [
    new AdministradorGeneral('30111222', 'Marta', 'Ferrari', 'admin@pinpun.com', '011 4862-3260', 'Av. Corrientes 3954', hashContrasena('pinpun2026')),
    new AdministradorSucursal('32333444', 'Raúl', 'Bianchi', 'almagro@pinpun.com', '011 4862-3260', 'Av. Corrientes 3954', hashContrasena('almagro2026'), 1),
    new AdministradorSucursal('33444555', 'Lucía', 'Conti', 'urquiza@pinpun.com', '011 4521-2181', 'La Pampa 5201', hashContrasena('urquiza2026'), 3)
];

const findByMail = (mail) => usuarios.find((usuario) => usuario.mail === mail.trim().toLowerCase()) ?? null;

export default { findByMail };
