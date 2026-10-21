import pedidoRepository from '../repositories/pedidoRepository.js';
import productoRepository from '../repositories/productoRepository.js';
import localService from './localService.js';
import { BadRequestError, ConflictError, NotFoundError } from '../exceptions/AppError.js';
import { CANCELADO, ESTADOS_PEDIDO } from '../enums/Estados.js';
import { Messages } from '../enums/Messages.js';
import { estaAbierto } from '../utils/horario.js';
import { exigirLocal, localDelListado } from '../utils/permisos.js';

/* Precio de un producto en una variante; null si esa variante no existe */
const precioDe = (producto, variante) => {
    if (producto.variantes.length === 0) return producto.precio;

    return producto.variantes.find((item) => item.nombre === variante)?.precio ?? null;
};

/*
 * El precio y el nombre se toman de la carta, no de lo que mande el navegador: el total lo calcula el servidor.
 * La mitad y mitad ("mitad:3-7") cobra la más cara de las dos, como en el mostrador.
 */
const resolverItem = ({ productoId, variante, cantidad }) => {
    const mitad = /^mitad:(\d+)-(\d+)$/.exec(String(productoId));

    if (mitad) {
        const pizzas = [mitad[1], mitad[2]].map((id) => productoRepository.findById(Number(id)));
        const precios = pizzas.map((pizza) => pizza && precioDe(pizza, variante));
        if (precios.some((precio) => precio === null || precio === undefined)) {
            throw new BadRequestError(Messages.PRODUCTO_DEL_PEDIDO_NOT_FOUND);
        }

        return {
            productoId: String(productoId),
            nombre: `Mitad ${pizzas[0].nombre} y mitad ${pizzas[1].nombre}`,
            categoria: 'Pizzas',
            subcategoria: '',
            variante,
            precio: Math.max(...precios),
            cantidad
        };
    }

    const producto = productoRepository.findById(Number(productoId));
    const precio = producto && precioDe(producto, variante);
    if (!producto || precio === null) throw new BadRequestError(Messages.PRODUCTO_DEL_PEDIDO_NOT_FOUND);

    return {
        productoId: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        subcategoria: producto.subcategoria,
        variante: producto.variantes.length > 0 ? variante : '',
        precio,
        cantidad
    };
};

const getAll = ({ localId, estado }, usuario) =>
    pedidoRepository.findAll({ localId: localDelListado(usuario, localId), estado });

const getById = (id, usuario) => {
    const pedido = pedidoRepository.findById(id);
    if (!pedido) throw new NotFoundError(Messages.PEDIDO_NOT_FOUND);
    exigirLocal(usuario, pedido.localId);

    return pedido;
};

const create = ({ localId, tipo, cliente, direccion, items }) => {
    const local = localService.getById(localId);
    if (!estaAbierto(local)) throw new ConflictError(Messages.LOCAL_CERRADO);

    const resueltos = items.map(resolverItem);
    const total = resueltos.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const estado = ESTADOS_PEDIDO[tipo][0];

    return pedidoRepository.create({
        fecha: new Date().toISOString(),
        total,
        tipo,
        estado,
        localId,
        cliente,
        direccion: tipo === 'delivery' ? direccion : '',
        items: resueltos
    });
};

/* Un pedido avanza al estado siguiente de su circuito o se cancela, mientras no esté terminado */
const cambiarEstado = (id, estado, usuario) => {
    const pedido = getById(id, usuario);
    const circuito = ESTADOS_PEDIDO[pedido.tipo];

    if (estado !== CANCELADO && !circuito.includes(estado)) throw new BadRequestError(Messages.INVALID_ESTADO);

    const terminado = pedido.estado === CANCELADO || pedido.estado === circuito.at(-1);
    const siguiente = circuito[circuito.indexOf(pedido.estado) + 1];
    if (terminado || (estado !== CANCELADO && estado !== siguiente)) throw new ConflictError(Messages.TRANSICION_INVALIDA);

    return pedidoRepository.cambiarEstado(id, estado, new Date().toISOString());
};

export default { getAll, getById, create, cambiarEstado };
