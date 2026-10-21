import { request } from './api.js';

const RUTA = '/seguimiento';

/*
 * El pedido de un cliente, por el código de su enlace (sin sesión): estado, recorrido, local, repartidor
 * y, mientras va en camino, la última posición del repartidor ({ latitud, longitud, precision, fecha }).
 */
export const getSeguimiento = (codigo, opciones) => request(`${RUTA}/${encodeURIComponent(codigo)}`, opciones);
