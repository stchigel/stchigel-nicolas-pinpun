import { BadRequestError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { isPositiveInteger } from './validators.js';

/* Filtros opcionales de los listados del panel: ?localId=1 y ?estado=Listo */
export const leerFiltrosDeGestion = ({ localId, estado }) => {
    if (localId !== undefined && !isPositiveInteger(localId)) throw new BadRequestError(Messages.INVALID_LOCAL_ID);

    return {
        localId: localId === undefined ? undefined : Number(localId),
        estado: typeof estado === 'string' && estado.trim() ? estado.trim() : undefined
    };
};
