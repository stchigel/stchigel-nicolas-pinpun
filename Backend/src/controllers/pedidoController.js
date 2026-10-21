import pedidoService from '../services/pedidoService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { leerFiltrosDeGestion } from '../utils/filtros.js';

const getAll = (req, res) => {
    ApiResponse.success(res, pedidoService.getAll(leerFiltrosDeGestion(req.query), req.usuario));
};

const getById = (req, res) => {
    ApiResponse.success(res, pedidoService.getById(Number(req.params.id), req.usuario));
};

const create = (req, res) => {
    ApiResponse.success(res, pedidoService.create(req.body), HttpStatus.CREATED);
};

const cambiarEstado = (req, res) => {
    ApiResponse.success(res, pedidoService.cambiarEstado(Number(req.params.id), req.body.estado, req.usuario));
};

export default { getAll, getById, create, cambiarEstado };
