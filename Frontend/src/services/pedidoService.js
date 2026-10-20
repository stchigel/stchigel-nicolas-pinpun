import { request } from './api.js';

const RUTA = '/pedidos';

/*
 * Envía el pedido armado en el carrito:
 * { localId, tipo: 'retiro' | 'delivery', cliente: { nombre, telefono }, direccion, items: [...] }
 */
export const crearPedido = (pedido, opciones) => request(RUTA, { method: 'POST', body: pedido, ...opciones });
