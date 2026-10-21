import productoService from '../services/productoService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { CANALES } from '../services/cartaService.js';
import { isPositiveInteger } from '../utils/validators.js';

/*
 * Filtros opcionales: ?categoria=Pizzas y ?destacado=true|false.
 * La carta se elige con ?cartaId=2 o con ?localId=1&canal=delivery (canal: salon, retiro o delivery; por defecto salon);
 * sin nada, es la carta general.
 */
const leerFiltros = ({ categoria, destacado, cartaId, localId, canal }) => {
    if (destacado !== undefined && destacado !== 'true' && destacado !== 'false') {
        throw new BadRequestError(Messages.INVALID_FILTRO_DESTACADO);
    }

    if (cartaId !== undefined && !isPositiveInteger(cartaId)) throw new BadRequestError(Messages.INVALID_CARTA_ID);
    if (localId !== undefined && !isPositiveInteger(localId)) throw new BadRequestError(Messages.INVALID_LOCAL_ID);
    if (canal !== undefined && !CANALES.includes(canal)) throw new BadRequestError(Messages.INVALID_CANAL);

    return {
        categoria: typeof categoria === 'string' && categoria.trim() ? categoria.trim() : undefined,
        destacado: destacado === undefined ? undefined : destacado === 'true',
        cartaId: cartaId === undefined ? undefined : Number(cartaId),
        localId: localId === undefined ? undefined : Number(localId),
        canal
    };
};

const getAll = (req, res) => {
    ApiResponse.success(res, productoService.getAll(leerFiltros(req.query)));
};

const getById = (req, res) => {
    ApiResponse.success(res, productoService.getById(Number(req.params.id)));
};

const create = (req, res) => {
    ApiResponse.success(res, productoService.create(req.body), HttpStatus.CREATED);
};

const update = (req, res) => {
    ApiResponse.success(res, productoService.update(Number(req.params.id), req.body));
};

const remove = (req, res) => {
    ApiResponse.success(res, productoService.remove(Number(req.params.id)));
};

export default { getAll, getById, create, update, remove };
