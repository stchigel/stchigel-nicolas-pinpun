import productoRepository from '../repositories/productoRepository.js';
import cartaService from './cartaService.js';
import { NotFoundError, ConflictError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

/* El nombre puede repetirse entre cartas, pero no entre dos platos de la misma sección de una misma carta */
const verificarNombreDisponible = (datos, idActual = null) => {
    const existente = productoRepository.findByNombre(datos);
    if (existente && existente.id !== idActual) throw new ConflictError(Messages.PRODUCTO_DUPLICATED);
};

/* Los platos de la carta pedida: la de un local en un canal, una en particular, o la carta general */
const getAll = ({ categoria, destacado, cartaId, localId, canal }) => {
    const carta = cartaService.resolver({ cartaId, localId, canal });

    return productoRepository.findAll({ categoria, destacado, cartaId: carta.id });
};

const getById = (id) => {
    const producto = productoRepository.findById(id);
    if (!producto) throw new NotFoundError(Messages.PRODUCTO_NOT_FOUND);

    return producto;
};

/* Se crea en la carta indicada (`cartaId`) o, si no se dice, en la carta general */
const create = (datos) => {
    const carta = cartaService.resolver({ cartaId: datos.cartaId });
    const completos = { ...datos, cartaId: carta.id };
    verificarNombreDisponible(completos);

    return productoRepository.create(completos);
};

/* Un plato no cambia de carta al editarlo */
const update = (id, datos) => {
    const actual = getById(id);
    verificarNombreDisponible({ ...datos, cartaId: actual.cartaId }, id);

    return productoRepository.update(id, datos);
};

const remove = (id) => {
    getById(id);

    return productoRepository.remove(id);
};

export default { getAll, getById, create, update, remove };
