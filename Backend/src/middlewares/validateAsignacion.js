import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { isPlainObject, isPositiveInteger } from '../utils/validators.js';

/*
 * Tres formas de pedir la asignación de un delivery:
 *   { repartidorId: 4 }        a ese repartidor
 *   { automatico: true }       al que menos pedidos lleve
 *   { repartidorId: null }     quitar el repartidor
 */
const validateAsignacion = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_ASIGNACION);

    const { repartidorId, automatico } = req.body;

    if (automatico === true) {
        req.body = { automatico: true, repartidorId: null };
    } else if (repartidorId === null) {
        req.body = { automatico: false, repartidorId: null };
    } else if (isPositiveInteger(repartidorId)) {
        req.body = { automatico: false, repartidorId: Number(repartidorId) };
    } else {
        throw new BadRequestError(Messages.INVALID_ASIGNACION);
    }

    next();
};

export default validateAsignacion;
