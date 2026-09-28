import productoService from '../services/productoService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { HttpStatus } from '../enums/HttpStatus.js';

const getAll = (req, res) => {
    ApiResponse.success(res, productoService.getAll());
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
