import pedidoRepository from '../repositories/pedidoRepository.js';
import ubicacionRepository from '../repositories/ubicacionRepository.js';
import usuarioRepository from '../repositories/usuarioRepository.js';
import localService from './localService.js';
import { asegurarDestino } from './destinoService.js';
import { refrescarRuta } from './rutaService.js';
import { NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';

/*
 * Lo que ve el cliente al seguir su pedido con el código de su enlace (sin sesión).
 * Solo lo necesario: el estado y su recorrido, lo que pidió, el local, el nombre de pila de quien reparte
 * y, mientras el pedido va en camino, la última posición del repartidor, el destino y el recorrido que le falta
 * (con su duración estimada). Nunca teléfonos ni datos de otros pedidos.
 */
const getPorCodigo = (codigo) => {
    const pedido = pedidoRepository.findByCodigo(codigo);
    if (!pedido) throw new NotFoundError(Messages.SEGUIMIENTO_NOT_FOUND);

    const local = localService.getById(pedido.localId);
    const repartidor = pedido.repartidorId ? usuarioRepository.findRepartidorById(pedido.repartidorId) : null;
    const enCamino = pedido.estado === 'En camino';

    /* Mirar el seguimiento es lo que dispara (con tope de frecuencia) la búsqueda del destino y el recálculo del recorrido */
    asegurarDestino(pedido);
    if (enCamino) refrescarRuta(pedido);

    const guardada = enCamino ? ubicacionRepository.buscar(pedido.id) : null;

    return {
        id: pedido.id,
        tipo: pedido.tipo,
        estado: pedido.estado,
        fecha: pedido.fecha,
        total: pedido.total,
        direccion: pedido.direccion,
        cliente: { nombre: pedido.cliente.nombre },
        historial: pedido.historial.map(({ estado, fecha }) => ({ estado, fecha })),
        items: pedido.items.map(({ nombre, variante, cantidad }) => ({ nombre, variante, cantidad })),
        local: {
            nombre: local.nombre,
            direccion: local.direccion,
            numero: local.numero,
            latitud: local.latitud,
            longitud: local.longitud
        },
        repartidor: repartidor ? { nombre: repartidor.nombre } : null,
        destino: pedido.destino,
        ubicacion: guardada && { latitud: guardada.latitud, longitud: guardada.longitud, precision: guardada.precision, fecha: guardada.fecha },
        ruta: guardada?.ruta ?? null
    };
};

export default { getPorCodigo };
