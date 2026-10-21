import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { isPlainObject, isNonEmptyString, isOptionalString } from '../utils/validators.js';

/* El nuevo estado de un pedido o una reserva, con un motivo opcional (por qué no se pudo entregar); si es válido para ese circuito lo decide el servicio */
const validateEstado = (req, res, next) => {
    if (!isPlainObject(req.body) || !isNonEmptyString(req.body.estado)) throw new BadRequestError(Messages.INVALID_ESTADO);

    const { motivo } = req.body;
    if (!isOptionalString(motivo) || (motivo?.length ?? 0) > 200) throw new BadRequestError(Messages.INVALID_MOTIVO);

    req.body = { estado: req.body.estado.trim(), motivo: motivo?.trim() ?? '' };

    next();
};

export default validateEstado;
