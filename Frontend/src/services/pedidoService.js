import { request } from './api.js';

const RUTA = '/pedidos';

/*
 * Envía el pedido armado en el carrito:
 * { localId, tipo: 'retiro' | 'delivery', cliente: { nombre, telefono }, direccion, items: [...] }
 * El total y los precios los calcula el servidor con la carta.
 */
export const crearPedido = (pedido, opciones) => request(RUTA, { method: 'POST', body: pedido, ...opciones });

/* Panel de administración: el administrador de sucursal recibe solo los de su local */
export const getPedidos = (opciones) => request(RUTA, opciones);

export const cambiarEstadoPedido = (id, estado) => request(`${RUTA}/${id}/estado`, { method: 'PATCH', body: { estado } });
