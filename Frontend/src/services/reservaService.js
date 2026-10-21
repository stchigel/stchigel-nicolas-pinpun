import { request } from './api.js';

const RUTA = '/reservas';

/*
 * Pide una mesa. La reserva queda "Esperando confirmación" hasta que el local la acepte o la rechace.
 * { localId, fechaHora (ISO), cantPersonas, cliente: { nombre, telefono }, aclaraciones }
 */
export const crearReserva = (reserva, opciones) => request(RUTA, { method: 'POST', body: reserva, ...opciones });

/* Panel de administración: el administrador de sucursal recibe solo las de su local */
export const getReservas = (opciones) => request(RUTA, opciones);

export const cambiarEstadoReserva = (id, estado) => request(`${RUTA}/${id}/estado`, { method: 'PATCH', body: { estado } });
