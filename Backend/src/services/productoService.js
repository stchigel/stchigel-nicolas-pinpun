import productoRepository from '../repositories/productoRepository.js';

const getAll = () => productoRepository.findAll();

const getById = (id) => productoRepository.findById(id);

const create = (datos) => productoRepository.create(datos);

const update = (id, datos) => productoRepository.update(id, datos);

const remove = (id) => productoRepository.remove(id);

export default { getAll, getById, create, update, remove };
