import localRepository from '../repositories/localRepository.js';
import { NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

const getAll = () => localRepository.findAll();

const getById = (id) => {
    const local = localRepository.findById(id);
    if (!local) throw new NotFoundError(Messages.LOCAL_NOT_FOUND);

    return local;
};

export default { getAll, getById };
