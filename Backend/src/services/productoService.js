import productoRepository from '../repositories/productoRepository.js';
import { NotFoundError, ConflictError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

const verificarNombreDisponible = (datos, idActual = null) => {
    const existente = productoRepository.findByNombre(datos);
    if (existente && existente.id !== idActual) throw new ConflictError(Messages.PRODUCTO_DUPLICATED);
};

const getAll = (filtros) => productoRepository.findAll(filtros);

const getById = (id) => {
    const producto = productoRepository.findById(id);
    if (!producto) throw new NotFoundError(Messages.PRODUCTO_NOT_FOUND);

    return producto;
};

const create = (datos) => {
    verificarNombreDisponible(datos);

    return productoRepository.create(datos);
};

const update = (id, datos) => {
    getById(id);
    verificarNombreDisponible(datos, id);

    return productoRepository.update(id, datos);
};

const remove = (id) => {
    getById(id);

    return productoRepository.remove(id);
};

export default { getAll, getById, create, update, remove };
