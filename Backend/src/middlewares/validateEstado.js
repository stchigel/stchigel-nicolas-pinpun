import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { isPlainObject, isNonEmptyString } from '../utils/validators.js';

/* El nuevo estado de un pedido o una reserva; si es válido para ese circuito lo decide el servicio */
const validateEstado = (req, res, next) => {
    if (!isPlainObject(req.body) || !isNonEmptyString(req.body.estado)) throw new BadRequestError(Messages.INVALID_ESTADO);

    req.body = { estado: req.body.estado.trim() };

    next();
};

export default validateEstado;
