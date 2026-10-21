import { Rol } from '../services/authService.js';
import { ForbiddenError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

/* El administrador general ve todo; el de sucursal, solo lo de su local; el repartidor no administra nada */
export const puedeGestionarLocal = (usuario, localId) =>
    usuario.rol === Rol.GENERAL || (usuario.rol === Rol.SUCURSAL && usuario.localId === localId);

export const exigirLocal = (usuario, localId) => {
    if (!puedeGestionarLocal(usuario, localId)) throw new ForbiddenError(Messages.FORBIDDEN);
};

/* Filtro de local para un listado: el de sucursal queda fijo en el suyo, el general puede elegir */
export const localDelListado = (usuario, localIdPedido) =>
    usuario.rol === Rol.SUCURSAL ? usuario.localId : localIdPedido;
