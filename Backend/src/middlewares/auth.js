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

/* Lo que es del panel de administración: lo toca el administrador general o el de una sucursal, nunca un repartidor */
export const exigirAdministracion = (req, res, next) => {
    if (req.usuario.rol === Rol.REPARTIDOR) throw new ForbiddenError(Messages.FORBIDDEN);

    next();
};

/* Lo que es solo de quien reparte (por ejemplo, compartir su ubicación en un pedido que lleva) */
export const exigirRepartidor = (req, res, next) => {
    if (req.usuario.rol !== Rol.REPARTIDOR) throw new ForbiddenError(Messages.FORBIDDEN);

    next();
};

/* Lo que solo toca el administrador general (por ejemplo, la carta, que es la misma para todos los locales) */
export const exigirGeneral = (req, res, next) => {
    if (req.usuario.rol !== Rol.GENERAL) throw new ForbiddenError(Messages.FORBIDDEN);

    next();
};
