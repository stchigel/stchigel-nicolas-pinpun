import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { HORA_VALIDA } from '../utils/horario.js';
import { isPlainObject, isIntegerBetween, isOptionalBoolean } from '../utils/validators.js';

const isMesa = (mesa) =>
    isPlainObject(mesa) && isIntegerBetween(mesa.capacidad, 1, 30) && isIntegerBetween(mesa.cantidad, 0, 200);

const vacio = (valor) => valor === undefined || valor === null || valor === '';

/* Los datos que administra la sucursal: teléfono, horario, mesas, si se pueden juntar y tope de personas por reserva */
const validateLocal = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_DATA);

    const { numero, horarioApertura, horarioCierre, mesas, reservaMaxPersonas, juntarMesas } = req.body;

    if (!vacio(numero) && typeof numero !== 'string') throw new BadRequestError(Messages.INVALID_TELEFONO);

    const sinHorario = vacio(horarioApertura) && vacio(horarioCierre);
    if (!sinHorario && !(HORA_VALIDA.test(horarioApertura) && HORA_VALIDA.test(horarioCierre))) {
        throw new BadRequestError(Messages.INVALID_HORARIO);
    }

    if (!Array.isArray(mesas) || !mesas.every(isMesa) || new Set(mesas.map((mesa) => mesa.capacidad)).size !== mesas.length) {
        throw new BadRequestError(Messages.INVALID_MESAS);
    }
    if (!isIntegerBetween(reservaMaxPersonas, 1, 100)) throw new BadRequestError(Messages.INVALID_RESERVA_MAX);
    if (!isOptionalBoolean(juntarMesas)) throw new BadRequestError(Messages.INVALID_JUNTAR_MESAS);

    req.body = {
        numero: vacio(numero) ? null : numero.trim(),
        horarioApertura: sinHorario ? null : horarioApertura,
        horarioCierre: sinHorario ? null : horarioCierre,
        mesas: mesas
            .filter((mesa) => mesa.cantidad > 0)
            .map(({ capacidad, cantidad }) => ({ capacidad, cantidad }))
            .sort((a, b) => a.capacidad - b.capacidad),
        reservaMaxPersonas,
        juntarMesas: juntarMesas ?? true
    };

    next();
};

export default validateLocal;
