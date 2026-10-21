import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { TipoPedido } from '../enums/Estados.js';
import {
    isPlainObject,
    isNonEmptyString,
    isOptionalString,
    isPositiveInteger,
    isIntegerBetween,
    isTelefono
} from '../utils/validators.js';

const MAXIMO_RENGLONES = 100;

const isItem = (item) =>
    isPlainObject(item) &&
    (typeof item.productoId === 'number' || isNonEmptyString(item.productoId)) &&
    isOptionalString(item.variante) &&
    isIntegerBetween(item.cantidad, 1, 99);

/* Solo se valida la forma: precios y nombres los resuelve el servicio con la carta */
const validatePedido = (req, res, next) => {
    if (!isPlainObject(req.body)) throw new BadRequestError(Messages.INVALID_DATA);

    const { localId, tipo, cliente, direccion, items } = req.body;

    if (!isPositiveInteger(localId)) throw new BadRequestError(Messages.INVALID_LOCAL_ID);
    if (!Object.values(TipoPedido).includes(tipo)) throw new BadRequestError(Messages.INVALID_TIPO_PEDIDO);
    if (!isPlainObject(cliente) || !isNonEmptyString(cliente.nombre) || !isTelefono(cliente.telefono)) {
        throw new BadRequestError(Messages.INVALID_CLIENTE);
    }
    if (tipo === TipoPedido.DELIVERY && !isNonEmptyString(direccion)) throw new BadRequestError(Messages.INVALID_DIRECCION);
    if (!Array.isArray(items) || items.length === 0 || items.length > MAXIMO_RENGLONES || !items.every(isItem)) {
        throw new BadRequestError(Messages.INVALID_ITEMS);
    }

    req.body = {
        localId: Number(localId),
        tipo,
        cliente: { nombre: cliente.nombre.trim(), telefono: cliente.telefono.trim() },
        direccion: direccion?.trim() ?? '',
        items: items.map(({ productoId, variante, cantidad }) => ({ productoId, variante: variante ?? '', cantidad }))
    };

    next();
};

export default validatePedido;
