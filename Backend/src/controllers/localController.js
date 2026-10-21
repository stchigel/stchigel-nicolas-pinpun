import localService from '../services/localService.js';
import ApiResponse from '../responses/ApiResponse.js';
import { exigirLocal } from '../utils/permisos.js';

const getAll = (req, res) => {
    ApiResponse.success(res, localService.getAll());
};

const getById = (req, res) => {
    ApiResponse.success(res, localService.getById(Number(req.params.id)));
};

const update = (req, res) => {
    const id = Number(req.params.id);
    exigirLocal(req.usuario, id);

    ApiResponse.success(res, localService.update(id, req.body));
};

export default { getAll, getById, update };
