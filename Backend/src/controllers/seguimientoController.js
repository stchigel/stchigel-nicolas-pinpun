import seguimientoService from '../services/seguimientoService.js';
import ApiResponse from '../responses/ApiResponse.js';

const getPorCodigo = (req, res) => {
    ApiResponse.success(res, seguimientoService.getPorCodigo(req.params.codigo));
};

export default { getPorCodigo };
