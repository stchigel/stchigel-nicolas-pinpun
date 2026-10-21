import pedidoRepository from '../repositories/pedidoRepository.js';
import productoRepository from '../repositories/productoRepository.js';
import usuarioRepository from '../repositories/usuarioRepository.js';
import ubicacionRepository from '../repositories/ubicacionRepository.js';
import localService from './localService.js';
import { asegurarDestino } from './destinoService.js';
import { refrescarRuta } from './rutaService.js';
import { Rol } from './authService.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../exceptions/AppError.js';
import {
    CANCELADO,
    ESTADOS_CANCELABLES_POR_REPARTIDOR,
    ESTADOS_DEL_REPARTIDOR,
    ESTADOS_PEDIDO,
    TipoPedido,
    estaTerminado
} from '../enums/Estados.js';
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

const esRepartidor = (usuario) => usuario.rol === Rol.REPARTIDOR;

/* Cuántos pedidos sin terminar tiene a cargo un repartidor */
export const cargaDe = (repartidorId) =>
    pedidoRepository.findAll({ repartidorId }).filter((pedido) => !estaTerminado(pedido)).length;

/* El repartidor ve solo los pedidos que le asignaron; la administración, los de su alcance */
const getAll = ({ localId, estado }, usuario) =>
    esRepartidor(usuario)
        ? pedidoRepository.findAll({ repartidorId: usuario.id, estado })
        : pedidoRepository.findAll({ localId: localDelListado(usuario, localId), estado });

const getById = (id, usuario) => {
    const pedido = pedidoRepository.findById(id);
    if (!pedido) throw new NotFoundError(Messages.PEDIDO_NOT_FOUND);

    if (esRepartidor(usuario)) {
        if (pedido.repartidorId !== usuario.id) throw new ForbiddenError(Messages.FORBIDDEN);
    } else {
        exigirLocal(usuario, pedido.localId);
    }

    return pedido;
};

const create = ({ localId, tipo, cliente, direccion, items }) => {
    const local = localService.getById(localId);
    if (!estaAbierto(local)) throw new ConflictError(Messages.LOCAL_CERRADO);

    const resueltos = items.map(resolverItem);
    const total = resueltos.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const estado = ESTADOS_PEDIDO[tipo][0];

    const creado = pedidoRepository.create({
        fecha: new Date().toISOString(),
        total,
        tipo,
        estado,
        localId,
        cliente,
        direccion: tipo === TipoPedido.DELIVERY ? direccion : '',
        items: resueltos
    });

    asegurarDestino(creado);

    return creado;
};

/*
 * Un pedido avanza al estado siguiente de su circuito o se cancela, mientras no esté terminado.
 * El repartidor solo puede salir con el pedido, entregarlo o, si ya lo tiene en la mano, cancelarlo (con su motivo).
 */
const cambiarEstado = (id, estado, usuario, motivo = '') => {
    const pedido = getById(id, usuario);
    const circuito = ESTADOS_PEDIDO[pedido.tipo];

    if (esRepartidor(usuario)) {
        if (!ESTADOS_DEL_REPARTIDOR.includes(estado)) throw new ForbiddenError(Messages.REPARTIDOR_NO_PUEDE);
        if (estado === CANCELADO && !ESTADOS_CANCELABLES_POR_REPARTIDOR.includes(pedido.estado)) {
            throw new ConflictError(Messages.TRANSICION_INVALIDA);
        }
    }

    if (estado !== CANCELADO && !circuito.includes(estado)) throw new BadRequestError(Messages.INVALID_ESTADO);

    const siguiente = circuito[circuito.indexOf(pedido.estado) + 1];
    if (estaTerminado(pedido) || (estado !== CANCELADO && estado !== siguiente)) throw new ConflictError(Messages.TRANSICION_INVALIDA);

    const actualizado = pedidoRepository.cambiarEstado(id, estado, new Date().toISOString(), motivo);
    if (estaTerminado(actualizado)) ubicacionRepository.borrar(id);

    return actualizado;
};

/*
 * El repartidor informa dónde está mientras lleva un pedido. Solo vale con el pedido En camino y solo del repartidor
 * al que está asignado (getById ya lo exige); el cliente la ve en su enlace de seguimiento.
 */
const informarUbicacion = (id, ubicacion, usuario) => {
    const pedido = getById(id, usuario);
    if (pedido.estado !== 'En camino') throw new ConflictError(Messages.UBICACION_SOLO_EN_CAMINO);

    const guardada = ubicacionRepository.guardar(id, ubicacion);
    asegurarDestino(pedido);
    refrescarRuta(pedido);

    return guardada;
};

/* Entre los repartidores activos del local, el que menos pedidos lleva; si empatan, al que hace más que no se le asigna uno */
const elegirAutomatico = (localId) => {
    const candidatos = usuarioRepository.findRepartidores({ localId }).filter((repartidor) => repartidor.activo);
    if (candidatos.length === 0) throw new ConflictError(Messages.SIN_REPARTIDORES);

    const ultimaAsignacion = (repartidor) =>
        pedidoRepository
            .findAll({ repartidorId: repartidor.id })
            .reduce((ultima, pedido) => Math.max(ultima, pedido.asignadoEn ? new Date(pedido.asignadoEn).getTime() : 0), 0);

    return candidatos
        .map((repartidor) => ({ repartidor, carga: cargaDe(repartidor.id), ultima: ultimaAsignacion(repartidor) }))
        .sort((a, b) => a.carga - b.carga || a.ultima - b.ultima || a.repartidor.id - b.repartidor.id)[0].repartidor;
};

/*
 * Asigna (o quita) el repartidor de un delivery. `automatico` elige al que tenga menos pedidos en curso.
 * Solo los deliveries sin terminar, y solo repartidores activos de la misma sucursal que el pedido.
 */
const asignarRepartidor = (id, { repartidorId, automatico }, usuario) => {
    const pedido = getById(id, usuario);

    if (pedido.tipo !== TipoPedido.DELIVERY) throw new BadRequestError(Messages.SOLO_DELIVERY_LLEVA_REPARTIDOR);
    if (estaTerminado(pedido)) throw new ConflictError(Messages.PEDIDO_TERMINADO);

    let elegido = null;

    if (automatico) {
        elegido = elegirAutomatico(pedido.localId);
    } else if (repartidorId !== null) {
        elegido = usuarioRepository.findRepartidorById(repartidorId);
        if (!elegido) throw new NotFoundError(Messages.REPARTIDOR_NOT_FOUND);
        if (!elegido.activo || elegido.local !== pedido.localId) throw new ConflictError(Messages.REPARTIDOR_INVALIDO);
    }

    ubicacionRepository.borrar(id);

    return pedidoRepository.asignar(id, elegido?.id ?? null, new Date().toISOString());
};

export default { getAll, getById, create, cambiarEstado, asignarRepartidor, informarUbicacion };
