import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import usuarioRepository from '../repositories/usuarioRepository.js';
import AdministradorSucursal from '../models/AdministradorSucursal.js';
import { UnauthorizedError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

/* En producción se define AUTH_SECRET; el valor por defecto solo sirve para desarrollar */
const SECRETO = process.env.AUTH_SECRET ?? 'pinpun-secreto-de-desarrollo';
const DURACION_SESION_MS = 8 * 60 * 60 * 1000;

export const Rol = Object.freeze({
    GENERAL: 'general',
    SUCURSAL: 'sucursal'
});

const firmar = (contenido) => createHmac('sha256', SECRETO).update(contenido).digest('base64url');

const contrasenaCorrecta = (contrasena, guardada) => {
    const [sal, hash] = guardada.split(':');
    const intento = scryptSync(contrasena, sal, 32);
    return timingSafeEqual(intento, Buffer.from(hash, 'hex'));
};

/* Lo que el panel necesita saber de quien entró; nunca la contraseña */
const datosPublicos = (usuario) => {
    const sucursal = usuario instanceof AdministradorSucursal;

    return {
        mail: usuario.mail,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: sucursal ? Rol.SUCURSAL : Rol.GENERAL,
        localId: sucursal ? usuario.local : null
    };
};

/* Token firmado "datos.firma": sin base de sesiones, vence solo a las 8 horas */
const crearToken = (usuario) => {
    const datos = Buffer.from(JSON.stringify({ mail: usuario.mail, vence: Date.now() + DURACION_SESION_MS })).toString('base64url');
    return `${datos}.${firmar(datos)}`;
};

const login = (mail, contrasena) => {
    const usuario = usuarioRepository.findByMail(mail);
    if (!usuario || !contrasenaCorrecta(contrasena, usuario.contrasena)) {
        throw new UnauthorizedError(Messages.INVALID_CREDENCIALES);
    }

    return { token: crearToken(usuario), usuario: datosPublicos(usuario) };
};

/* Devuelve el usuario del token, o lanza si falta, está adulterado o venció */
const verificarToken = (token) => {
    const [datos, firma] = (token ?? '').split('.');
    if (!datos || !firma) throw new UnauthorizedError(Messages.UNAUTHORIZED);

    const esperada = Buffer.from(firmar(datos));
    const recibida = Buffer.from(firma);
    if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) {
        throw new UnauthorizedError(Messages.UNAUTHORIZED);
    }

    const { mail, vence } = JSON.parse(Buffer.from(datos, 'base64url').toString());
    if (Date.now() > vence) throw new UnauthorizedError(Messages.SESION_VENCIDA);

    const usuario = usuarioRepository.findByMail(mail);
    if (!usuario) throw new UnauthorizedError(Messages.UNAUTHORIZED);

    return datosPublicos(usuario);
};

export default { login, verificarToken };
