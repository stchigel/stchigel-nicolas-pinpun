import productoService from '../services/productoService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

/* Filtros opcionales: ?categoria=Pizzas y ?destacado=true|false */
const leerFiltros = ({ categoria, destacado }) => {
    if (destacado !== undefined && destacado !== 'true' && destacado !== 'false') {
        throw new BadRequestError(Messages.INVALID_FILTRO_DESTACADO);
    }

    return {
        categoria: typeof categoria === 'string' && categoria.trim() ? categoria.trim() : undefined,
        destacado: destacado === undefined ? undefined : destacado === 'true'
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
