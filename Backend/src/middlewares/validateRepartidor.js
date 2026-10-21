import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import {
    isPlainObject,
    isNonEmptyString,
    isOptionalString,
    isOptionalBoolean,
    isPositiveInteger,
    isTelefono
} from '../utils/validators.js';

const MAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MINIMO_CONTRASENA = 8;

const datosBasicos = (cuerpo) => {
    const { nombre, apellido, numero } = cuerpo;

    if (!isNonEmptyString(nombre) || !isNonEmptyString(apellido) || !isTelefono(numero)) {
        throw new BadRequestError(Messages.INVALID_REPARTIDOR);
    }

    return { nombre: nombre.trim(), apellido: apellido.trim(), numero: numero.trim() };
};

const contrasenaValida = (contrasena) => typeof contrasena === 'string' && contrasena.length >= LARGO_MINIMO_CONTRASENA;

/* Alta: todos los datos, el mail y una contraseña; `localId` lo usa solo la administración general */
export const validateAltaRepartidor = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_DATA);

    const { mail, contrasena, localId, dni } = req.body;
    const basicos = datosBasicos(req.body);

    if (!isNonEmptyString(mail) || !MAIL_VALIDO.test(mail.trim()) || !contrasenaValida(contrasena)) {
        throw new BadRequestError(Messages.INVALID_REPARTIDOR);
    }
    if (localId !== undefined && !isPositiveInteger(localId)) throw new BadRequestError(Messages.INVALID_LOCAL_ID);
    if (!isOptionalString(dni)) throw new BadRequestError(Messages.INVALID_REPARTIDOR);

    req.body = { ...basicos, mail: mail.trim(), contrasena, dni: dni?.trim() ?? '', localId: localId === undefined ? undefined : Number(localId) };

    next();
};

/* Edición: nombre, apellido, teléfono y si está activo; la contraseña solo si se quiere cambiar */
export const validateEdicionRepartidor = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_DATA);

    const { activo, contrasena } = req.body;
    const basicos = datosBasicos(req.body);

    if (!isOptionalBoolean(activo)) throw new BadRequestError(Messages.INVALID_REPARTIDOR);
    if (contrasena !== undefined && contrasena !== '' && !contrasenaValida(contrasena)) throw new BadRequestError(Messages.INVALID_REPARTIDOR);

    req.body = { ...basicos, activo: activo ?? true, contrasena: contrasena || undefined };

    next();
};
