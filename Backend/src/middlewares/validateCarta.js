import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { isPlainObject, isNonEmptyString, isPositiveInteger } from '../utils/validators.js';

const MAXIMO_NOMBRE = 60;
const CANALES = ['salon', 'retiro', 'delivery'];

const nombreValido = (nombre) => isNonEmptyString(nombre) && nombre.trim().length <= MAXIMO_NOMBRE;

/* Crear una carta: su nombre y, si se quiere partir de otra, el id de la que se copia */
export const validateAltaCarta = (req, res, next) => {
    if (!isPlainObject(req.body) || !nombreValido(req.body.nombre)) throw new BadRequestError(Messages.INVALID_CARTA);

    const { nombre, copiarDeId } = req.body;
    if (copiarDeId !== undefined && !isPositiveInteger(copiarDeId)) throw new BadRequestError(Messages.INVALID_CARTA);

    req.body = { nombre: nombre.trim(), copiarDeId: copiarDeId === undefined ? undefined : Number(copiarDeId) };

    next();
};

export const validateNombreCarta = (req, res, next) => {
    if (!isPlainObject(req.body) || !nombreValido(req.body.nombre)) throw new BadRequestError(Messages.INVALID_CARTA);

    req.body = { nombre: req.body.nombre.trim() };

    next();
};

/* Qué carta usa un local: { salon, retiro, delivery }, con al menos un canal y cada uno con el id de una carta */
export const validateAsignacionCartas = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_ASIGNACION_CARTAS);

    const canales = Object.keys(req.body);
    if (canales.length === 0 || !canales.every((canal) => CANALES.includes(canal) && isPositiveInteger(req.body[canal]))) {
        throw new BadRequestError(Messages.INVALID_ASIGNACION_CARTAS);
    }

    req.body = Object.fromEntries(canales.map((canal) => [canal, Number(req.body[canal])]));

    next();
};
