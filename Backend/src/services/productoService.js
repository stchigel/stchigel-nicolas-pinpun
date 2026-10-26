import productoRepository from '../repositories/productoRepository.js';
import cartaService from './cartaService.js';
import { BadRequestError, NotFoundError, ConflictError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

/* El nombre puede repetirse entre cartas, pero no entre dos platos de la misma sección de una misma carta */
const verificarNombreDisponible = (datos, idActual = null) => {
    const existente = productoRepository.findByNombre(datos);
    if (existente && existente.id !== idActual) throw new ConflictError(Messages.PRODUCTO_DUPLICATED);
};

/* Los platos de la carta pedida: la de un local en un canal, una en particular, o la carta original (la de Corrientes) */
const getAll = ({ categoria, destacado, cartaId, localId, canal, tipo }) => {
    const carta = cartaService.resolver({ cartaId, localId, canal });

    return productoRepository.findAll({ categoria, destacado, cartaId: carta.id, tipo });
};

const getById = (id) => {
    const producto = productoRepository.findById(id);
    if (!producto) throw new NotFoundError(Messages.PRODUCTO_NOT_FOUND);

    return producto;
};

/*
 * Los componentes de un combo tienen que ser platos simples de la misma carta (un combo no se arma con otros combos ni consigo mismo)
 * y, si el plato viene en tamaños, decir cuál; si no, no llevar ninguno.
 */
const verificarComponentes = (componentes, cartaId, comboId = null) => {
    for (const { productoId, variante } of componentes) {
        const componente = productoRepository.findById(productoId);
        const tamanoValido =
            componente &&
            (componente.variantes.length === 0 ? variante === '' : componente.variantes.some((tamano) => tamano.nombre === variante));

        if (!componente || componente.cartaId !== cartaId || componente.tipo !== 'simple' || componente.id === comboId || !tamanoValido) {
            throw new BadRequestError(Messages.COMPONENTE_INVALIDO);
        }
    }
};

/* Un plato que forma parte de un combo no puede volverse combo ni perder el tamaño que el combo usa */
const verificarQueSigaSirviendo = (id, datos) => {
    const usos = productoRepository.usosEnCombos(id);
    if (usos.length === 0) return;

    const sigue =
        datos.tipo === 'simple' &&
        usos.every(({ variante }) => (variante === '' ? datos.variantes.length === 0 : datos.variantes.some((tamano) => tamano.nombre === variante)));
    if (!sigue) throw new ConflictError(Messages.PRODUCTO_EN_COMBO);
};

/* Se crea en la carta indicada (`cartaId`) o, si no se dice, en la carta original (la de Corrientes) */
const create = (datos) => {
    const carta = cartaService.resolver({ cartaId: datos.cartaId });
    const completos = { ...datos, cartaId: carta.id };
    verificarNombreDisponible(completos);
    verificarComponentes(completos.componentes ?? [], carta.id);

    return productoRepository.create(completos);
};

/* Un plato no cambia de carta al editarlo */
const update = (id, datos) => {
    const actual = getById(id);
    verificarNombreDisponible({ ...datos, cartaId: actual.cartaId }, id);
    verificarComponentes(datos.componentes ?? [], actual.cartaId, id);
    verificarQueSigaSirviendo(id, datos);

    return productoRepository.update(id, datos);
};

const remove = (id) => {
    getById(id);
    if (productoRepository.usosEnCombos(id).length > 0) throw new ConflictError(Messages.PRODUCTO_EN_COMBO);

    return productoRepository.remove(id);
};

export default { getAll, getById, create, update, remove };
