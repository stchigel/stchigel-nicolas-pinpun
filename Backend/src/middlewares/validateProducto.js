import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import {
    isPlainObject,
    isNonEmptyString,
    isOptionalString,
    isOptionalBoolean,
    isPositiveNumber
} from '../utils/validators.js';

const isVariante = (variante) =>
    isPlainObject(variante) && isNonEmptyString(variante.nombre) && isPositiveNumber(variante.precio);

const validateProducto = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_DATA);

    const { nombre, categoria, subcategoria, imagen, precio, variantes, descripcion, destacado } = req.body;
    const tieneVariantes = Array.isArray(variantes) && variantes.length > 0;

    if (!isNonEmptyString(nombre)) throw new BadRequestError(Messages.INVALID_NOMBRE);
    if (!isNonEmptyString(categoria)) throw new BadRequestError(Messages.INVALID_CATEGORIA);
    if (!isOptionalString(subcategoria)) throw new BadRequestError(Messages.INVALID_SUBCATEGORIA);
    if (variantes !== undefined && (!Array.isArray(variantes) || !variantes.every(isVariante))) {
        throw new BadRequestError(Messages.INVALID_VARIANTES);
    }
    if (!tieneVariantes && !isPositiveNumber(precio)) throw new BadRequestError(Messages.INVALID_PRECIO);
    if (!isOptionalString(imagen)) throw new BadRequestError(Messages.INVALID_IMAGEN);
    if (!isOptionalString(descripcion)) throw new BadRequestError(Messages.INVALID_DESCRIPCION);
    if (!isOptionalBoolean(destacado)) throw new BadRequestError(Messages.INVALID_DESTACADO);

    req.body = {
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        subcategoria: subcategoria?.trim() ?? '',
        imagen: imagen ?? '',
        precio: tieneVariantes ? variantes[0].precio : precio,
        variantes: tieneVariantes ? variantes.map(({ nombre, precio }) => ({ nombre: nombre.trim(), precio })) : [],
        descripcion: descripcion ?? '',
        destacado: destacado ?? false
    };

    next();
};

export default validateProducto;
