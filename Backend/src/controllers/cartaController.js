import cartaService from '../services/cartaService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { HttpStatus } from '../enums/HttpStatus.js';

const getAll = (req, res) => {
    ApiResponse.success(res, cartaService.getAll());
};

const create = (req, res) => {
    ApiResponse.success(res, cartaService.create(req.body), HttpStatus.CREATED);
};

const renombrar = (req, res) => {
    ApiResponse.success(res, cartaService.renombrar(Number(req.params.id), req.body.nombre));
};

const remove = (req, res) => {
    ApiResponse.success(res, cartaService.remove(Number(req.params.id)));
};

const asignarALocal = (req, res) => {
    ApiResponse.success(res, cartaService.asignarALocal(Number(req.params.id), req.body));
};

export default { getAll, create, renombrar, remove, asignarALocal };
