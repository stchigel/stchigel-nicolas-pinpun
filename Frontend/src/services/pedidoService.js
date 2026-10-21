import { request } from './api.js';

const RUTA = '/pedidos';

/*
 * Envía el pedido armado en el carrito:
 * { localId, tipo: 'retiro' | 'delivery', cliente: { nombre, telefono }, direccion, items: [...] }
 * El total y los precios los calcula el servidor con la carta.
 */
export const crearPedido = (pedido, opciones) => request(RUTA, { method: 'POST', body: pedido, ...opciones });

/* Panel y portal de reparto: la sucursal recibe los de su local; el repartidor, solo los que le asignaron */
export const getPedidos = (opciones) => request(RUTA, opciones);

/* `motivo` explica por qué no se pudo entregar cuando el repartidor cancela */
export const cambiarEstadoPedido = (id, estado, motivo) =>
    request(`${RUTA}/${id}/estado`, { method: 'PATCH', body: motivo ? { estado, motivo } : { estado } });

/* El repartidor informa dónde está mientras lleva el pedido: { latitud, longitud, precision } */
export const informarUbicacion = (id, ubicacion) => request(`${RUTA}/${id}/ubicacion`, { method: 'PUT', body: ubicacion });

/* A quién le toca un delivery: { repartidorId }, { automatico: true } o { repartidorId: null } para quitarlo */
export const asignarRepartidor = (id, asignacion) => request(`${RUTA}/${id}/repartidor`, { method: 'PATCH', body: asignacion });
