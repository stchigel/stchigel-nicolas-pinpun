import pedidoRepository from '../repositories/pedidoRepository.js';
import { estaTerminado } from '../enums/Estados.js';
import localService from './localService.js';
import { geocodificar } from './geografiaService.js';

const REINTENTAR_CADA_MS = 60 * 1000;
const enBusqueda = new Set();

/*
 * Ubica en el mapa la dirección de un delivery, en segundo plano: el pedido nunca espera a internet.
 * Si no se encuentra (o el servicio no responde) se reintenta como mucho una vez por minuto, y solo
 * cuando alguien mira el seguimiento, así que una dirección inexistente no genera tráfico de más.
 */
export const asegurarDestino = (pedido) => {
    if (pedido.tipo !== 'delivery' || pedido.destino || estaTerminado(pedido) || enBusqueda.has(pedido.id)) return;
    if (pedido.destinoIntentadoEn && Date.now() - pedido.destinoIntentadoEn < REINTENTAR_CADA_MS) return;

    enBusqueda.add(pedido.id);
    pedidoRepository.marcarDestinoIntentado(pedido.id);

    /* La dirección se busca cerca del local (donde reparte) y con su barrio ("Av. Corrientes 3954, Almagro" → "Almagro") */
    const local = localService.getById(pedido.localId);
    const zona = local.direccion.split(',').at(-1).trim();

    geocodificar(pedido.direccion, { zona, cerca: { latitud: local.latitud, longitud: local.longitud } })
        .then((destino) => {
            if (destino) pedidoRepository.guardarDestino(pedido.id, destino);
        })
        .catch(() => {})
        .finally(() => enBusqueda.delete(pedido.id));
};
