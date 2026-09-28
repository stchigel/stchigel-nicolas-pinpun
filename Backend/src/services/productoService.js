import productoRepository from '../repositories/productoRepository.js';
import { NotFoundError, ConflictError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

const verificarNombreDisponible = (nombre, idActual = null) => {
    const existente = productoRepository.findByNombre(nombre);
    if (existente && existente.id !== idActual) throw new ConflictError(Messages.PRODUCTO_DUPLICATED);
};

const getAll = () => productoRepository.findAll();

const getById = (id) => {
    const producto = productoRepository.findById(id);
    if (!producto) throw new NotFoundError(Messages.PRODUCTO_NOT_FOUND);

    return producto;
};

const create = (datos) => {
    verificarNombreDisponible(datos.nombre);

    return productoRepository.create(datos);
};

const update = (id, datos) => {
    getById(id);
    verificarNombreDisponible(datos.nombre, id);

    return productoRepository.update(id, datos);
};

const remove = (id) => {
    getById(id);

    return productoRepository.remove(id);
};

export default { getAll, getById, create, update, remove };
