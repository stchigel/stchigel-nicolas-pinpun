import authService, { Rol } from '../services/authService.js';
import { ForbiddenError, UnauthorizedError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

/* Exige "Authorization: Bearer <token>" y deja el usuario en req.usuario */
export const autenticar = (req, res, next) => {
    const [esquema, token] = (req.headers.authorization ?? '').split(' ');
    if (esquema !== 'Bearer' || !token) throw new UnauthorizedError(Messages.UNAUTHORIZED);

    req.usuario = authService.verificarToken(token);
    next();
};

/* Lo que solo toca el administrador general (por ejemplo, la carta, que es la misma para todos los locales) */
export const exigirGeneral = (req, res, next) => {
    if (req.usuario.rol !== Rol.GENERAL) throw new ForbiddenError(Messages.FORBIDDEN);

    next();
};
