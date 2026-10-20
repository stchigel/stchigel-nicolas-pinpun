import { request } from './api.js';

const RUTA = '/reservas';

/*
 * Pide una mesa. La reserva queda "Esperando confirmación" hasta que el local la acepte o la rechace.
 * { localId, fechaHora (ISO), cantPersonas, cliente: { nombre, telefono }, aclaraciones }
 */
export const crearReserva = (reserva, opciones) => request(RUTA, { method: 'POST', body: reserva, ...opciones });
