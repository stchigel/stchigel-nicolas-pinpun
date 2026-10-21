import { request } from './api.js';

const RUTA = '/repartidores';

/* Panel de administración: la sucursal recibe solo sus repartidores, con cuántos pedidos sin terminar lleva cada uno */
export const getRepartidores = (opciones) => request(RUTA, opciones);

/* { nombre, apellido, mail, numero, contrasena, localId } (el localId solo lo usa la administración general) */
export const crearRepartidor = (repartidor) => request(RUTA, { method: 'POST', body: repartidor });

/* { nombre, apellido, numero, activo, contrasena? }: la contraseña solo se manda si se quiere cambiar */
export const actualizarRepartidor = (id, repartidor) => request(`${RUTA}/${id}`, { method: 'PUT', body: repartidor });
