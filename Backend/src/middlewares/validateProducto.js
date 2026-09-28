import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import {
    isPlainObject,
    isNonEmptyString,
    isOptionalString,
    isPositiveNumber
} from '../utils/validators.js';

const validateProducto = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_DATA);

    const { nombre, imagen, precio, descripcion } = req.body;

    if (!isNonEmptyString(nombre)) throw new BadRequestError(Messages.INVALID_NOMBRE);
    if (!isPositiveNumber(precio)) throw new BadRequestError(Messages.INVALID_PRECIO);
    if (!isOptionalString(imagen)) throw new BadRequestError(Messages.INVALID_IMAGEN);
    if (!isOptionalString(descripcion)) throw new BadRequestError(Messages.INVALID_DESCRIPCION);

    req.body = {
        nombre: nombre.trim(),
        imagen: imagen ?? '',
        precio,
        descripcion: descripcion ?? ''
    };

    next();
};

export default validateProducto;
