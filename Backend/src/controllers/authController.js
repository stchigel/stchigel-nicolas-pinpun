import authService from '../services/authService.js';
import ApiResponse from '../responses/ApiResponse.js';

const login = (req, res) => {
    ApiResponse.success(res, authService.login(req.body.mail, req.body.contrasena));
};

/* Quién es el usuario del token: el panel lo usa para retomar la sesión al recargar */
const me = (req, res) => {
    ApiResponse.success(res, req.usuario);
};

export default { login, me };
