import productoService from '../services/productoService.js';
import { HttpStatus } from '../enums/HttpStatus.js';

const getAll = (req, res) => {
    res.status(HttpStatus.OK).json(productoService.getAll());
};

const getById = (req, res) => {
    res.status(HttpStatus.OK).json(productoService.getById(Number(req.params.id)));
};

const create = (req, res) => {
    res.status(HttpStatus.CREATED).json(productoService.create(req.body));
};

const update = (req, res) => {
    res.status(HttpStatus.OK).json(productoService.update(Number(req.params.id), req.body));
};

const remove = (req, res) => {
    res.status(HttpStatus.OK).json(productoService.remove(Number(req.params.id)));
};

export default { getAll, getById, create, update, remove };
