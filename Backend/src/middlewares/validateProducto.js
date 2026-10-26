import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import {
    isPlainObject,
    isNonEmptyString,
    isOptionalString,
    isOptionalBoolean,
    isPositiveNumber,
    isPositiveInteger
} from '../utils/validators.js';

const isVariante = (variante) =>
    isPlainObject(variante) && isNonEmptyString(variante.nombre) && isPositiveNumber(variante.precio);

const isComponente = (componente) =>
    isPlainObject(componente) &&
    isPositiveInteger(componente.productoId) &&
    isOptionalString(componente.variante) &&
    isPositiveInteger(componente.cantidad) &&
    Number(componente.cantidad) <= 99;

const validateProducto = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_DATA);

    const { nombre, categoria, subcategoria, imagen, precio, variantes, descripcion, destacado, cartaId, tipo = 'simple', componentes } = req.body;
    const esCombo = tipo === 'combo';
    const tieneVariantes = !esCombo && Array.isArray(variantes) && variantes.length > 0;

    if (!isNonEmptyString(nombre)) throw new BadRequestError(Messages.INVALID_NOMBRE);
    if (!isNonEmptyString(categoria)) throw new BadRequestError(Messages.INVALID_CATEGORIA);
    if (!isOptionalString(subcategoria)) throw new BadRequestError(Messages.INVALID_SUBCATEGORIA);
    if (tipo !== 'simple' && tipo !== 'combo') throw new BadRequestError(Messages.INVALID_TIPO_PRODUCTO);
    if (!esCombo && variantes !== undefined && (!Array.isArray(variantes) || !variantes.every(isVariante))) {
        throw new BadRequestError(Messages.INVALID_VARIANTES);
    }
    if (esCombo) {
        const claves = Array.isArray(componentes) ? componentes.map((c) => `${c?.productoId}|${(c?.variante ?? '').trim()}`) : [];
        if (!Array.isArray(componentes) || componentes.length === 0 || !componentes.every(isComponente) || new Set(claves).size !== claves.length) {
            throw new BadRequestError(Messages.INVALID_COMPONENTES);
        }
    }
    if (!tieneVariantes && !isPositiveNumber(precio)) throw new BadRequestError(Messages.INVALID_PRECIO);
    if (!isOptionalString(imagen)) throw new BadRequestError(Messages.INVALID_IMAGEN);
    if (!isOptionalString(descripcion)) throw new BadRequestError(Messages.INVALID_DESCRIPCION);
    if (!isOptionalBoolean(destacado)) throw new BadRequestError(Messages.INVALID_DESTACADO);
    if (cartaId !== undefined && !isPositiveInteger(cartaId)) throw new BadRequestError(Messages.INVALID_CARTA_ID);

    req.body = {
        nombre: nombre.trim(),
        categoria: categoria.trim(),
        subcategoria: subcategoria?.trim() ?? '',
        imagen: imagen ?? '',
        precio: tieneVariantes ? variantes[0].precio : precio,
        variantes: tieneVariantes ? variantes.map(({ nombre, precio }) => ({ nombre: nombre.trim(), precio })) : [],
        tipo,
        componentes: esCombo
            ? componentes.map((c) => ({ productoId: Number(c.productoId), variante: (c.variante ?? '').trim(), cantidad: Number(c.cantidad) }))
            : [],
        descripcion: descripcion ?? '',
        destacado: destacado ?? false,
        cartaId: cartaId === undefined ? undefined : Number(cartaId)
    };

    next();
};

export default validateProducto;
