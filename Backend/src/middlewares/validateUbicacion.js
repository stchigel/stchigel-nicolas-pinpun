import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { isPlainObject } from '../utils/validators.js';

const esNumeroEntre = (valor, minimo, maximo) => typeof valor === 'number' && Number.isFinite(valor) && valor >= minimo && valor <= maximo;

/* Una posición del GPS: latitud, longitud y, si el teléfono la informa, la precisión en metros */
const validateUbicacion = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_UBICACION);

    const { latitud, longitud, precision } = req.body;
    const precisionValida = precision === undefined || precision === null || esNumeroEntre(precision, 0, 100000);

    if (!esNumeroEntre(latitud, -90, 90) || !esNumeroEntre(longitud, -180, 180) || !precisionValida) {
        throw new BadRequestError(Messages.INVALID_UBICACION);
    }

    req.body = { latitud, longitud, precision: precision ?? null };

    next();
};

export default validateUbicacion;
