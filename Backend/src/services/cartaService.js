import cartaRepository from '../repositories/cartaRepository.js';
import localService from './localService.js';
import { ConflictError, NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

export const CANALES = ['salon', 'retiro', 'delivery'];

const getAll = () => cartaRepository.findAll();

const getById = (id) => {
    const carta = cartaRepository.findById(id);
    if (!carta) throw new NotFoundError(Messages.CARTA_NOT_FOUND);

    return carta;
};

const verificarNombreDisponible = (nombre, idActual = null) => {
    const existente = cartaRepository.findByNombre(nombre);
    if (existente && existente.id !== idActual) throw new ConflictError(Messages.CARTA_DUPLICATED);
};

/*
 * La carta que corresponde a un pedido de datos de la API:
 * - `cartaId`: esa carta (para editarla desde el panel);
 * - `localId` (con `canal`, por defecto el salón): la que usa ese local en ese canal;
 * - nada: la carta general, la primera que se creó (lo que muestra el sitio mientras no sepa de qué local es).
 */
const resolver = ({ cartaId, localId, canal = 'salon' }) => {
    if (cartaId !== undefined) return getById(cartaId);

    if (localId !== undefined) {
        localService.getById(localId);
        const carta = cartaRepository.deLocal(localId, canal);
        if (!carta) throw new NotFoundError(Messages.LOCAL_SIN_CARTA);

        return carta;
    }

    return cartaRepository.predeterminada();
};

/* Una carta vacía, o una copia de otra con todos sus platos y tamaños (`copiarDeId`) */
const create = ({ nombre, copiarDeId }) => {
    verificarNombreDisponible(nombre);
    if (copiarDeId !== undefined) getById(copiarDeId);

    return copiarDeId === undefined ? cartaRepository.create(nombre) : cartaRepository.duplicar(copiarDeId, nombre);
};

const renombrar = (id, nombre) => {
    getById(id);
    verificarNombreDisponible(nombre, id);

    return cartaRepository.renombrar(id, nombre);
};

/* No se borra una carta que algún local está usando, ni la última que queda */
const remove = (id) => {
    const carta = getById(id);
    if (carta.usos.length > 0) throw new ConflictError(Messages.CARTA_EN_USO);
    if (cartaRepository.findAll().length === 1) throw new ConflictError(Messages.ULTIMA_CARTA);

    return cartaRepository.remove(id);
};

/* Elige qué carta usa un local en uno o más canales: { salon: 2, delivery: 3 } */
const asignarALocal = (localId, cartas) => {
    localService.getById(localId);
    Object.values(cartas).forEach(getById);

    return localService.asignarCartas(localId, cartas);
};

export default { getAll, getById, resolver, create, renombrar, remove, asignarALocal };
