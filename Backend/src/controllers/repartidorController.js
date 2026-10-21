import repartidorService from '../services/repartidorService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { leerFiltrosDeGestion } from '../utils/filtros.js';

const getAll = (req, res) => {
    ApiResponse.success(res, repartidorService.getAll(leerFiltrosDeGestion(req.query), req.usuario));
};

const create = (req, res) => {
    ApiResponse.success(res, repartidorService.create(req.body, req.usuario), HttpStatus.CREATED);
};

const update = (req, res) => {
    ApiResponse.success(res, repartidorService.update(Number(req.params.id), req.body, req.usuario));
};

export default { getAll, create, update };
