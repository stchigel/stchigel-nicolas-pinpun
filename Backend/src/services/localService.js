import localRepository from '../repositories/localRepository.js';
import { NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

const getAll = () => localRepository.findAll();

const getById = (id) => {
    const local = localRepository.findById(id);
    if (!local) throw new NotFoundError(Messages.LOCAL_NOT_FOUND);

    return local;
};

const update = (id, datos) => {
    getById(id);

    return localRepository.update(id, datos);
};

const asignarCartas = (id, cartas) => localRepository.asignarCartas(id, cartas);

export default { getAll, getById, update, asignarCartas };
