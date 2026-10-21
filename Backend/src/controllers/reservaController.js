import reservaService from '../services/reservaService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { leerFiltrosDeGestion } from '../utils/filtros.js';

const getAll = (req, res) => {
    ApiResponse.success(res, reservaService.getAll(leerFiltrosDeGestion(req.query), req.usuario));
};

const getById = (req, res) => {
    ApiResponse.success(res, reservaService.getById(Number(req.params.id), req.usuario));
};

const create = (req, res) => {
    ApiResponse.success(res, reservaService.create(req.body), HttpStatus.CREATED);
};

const cambiarEstado = (req, res) => {
    ApiResponse.success(res, reservaService.cambiarEstado(Number(req.params.id), req.body.estado, req.usuario));
};

export default { getAll, getById, create, cambiarEstado };
