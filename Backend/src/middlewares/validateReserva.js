import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import {
    isPlainObject,
    isNonEmptyString,
    isOptionalString,
    isPositiveInteger,
    isIntegerBetween,
    isTelefono
} from '../utils/validators.js';

const MAXIMO_ACLARACIONES = 300;

/* Solo se valida la forma: el horario, el tope de personas y el lugar disponible los resuelve el servicio */
const validateReserva = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_DATA);

    const { localId, fechaHora, cantPersonas, cliente, aclaraciones } = req.body;

    if (!isPositiveInteger(localId)) throw new BadRequestError(Messages.INVALID_LOCAL_ID);
    if (!isNonEmptyString(fechaHora) || Number.isNaN(new Date(fechaHora).getTime())) {
        throw new BadRequestError(Messages.INVALID_FECHA_HORA);
    }
    if (!isIntegerBetween(cantPersonas, 1, 1000)) throw new BadRequestError(Messages.INVALID_CANT_PERSONAS);
    if (!isPlainObject(cliente) || !isNonEmptyString(cliente.nombre) || !isTelefono(cliente.telefono)) {
        throw new BadRequestError(Messages.INVALID_CLIENTE);
    }
    if (!isOptionalString(aclaraciones) || (aclaraciones?.length ?? 0) > MAXIMO_ACLARACIONES) {
        throw new BadRequestError(Messages.INVALID_ACLARACIONES);
    }

    req.body = {
        localId: Number(localId),
        fechaHora,
        cantPersonas,
        cliente: { nombre: cliente.nombre.trim(), telefono: cliente.telefono.trim() },
        aclaraciones: aclaraciones?.trim() ?? ''
    };

    next();
};

export default validateReserva;
