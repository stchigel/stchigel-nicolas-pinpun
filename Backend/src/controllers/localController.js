import localService from '../services/localService.js';
import ApiResponse from '../responses/ApiResponse.js';

const getAll = (req, res) => {
    ApiResponse.success(res, localService.getAll());
};

const getById = (req, res) => {
    ApiResponse.success(res, localService.getById(Number(req.params.id)));
};

export default { getAll, getById };
