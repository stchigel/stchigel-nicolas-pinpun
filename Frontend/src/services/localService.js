import { request } from './api.js';

const RUTA = '/locales';

export const getLocales = (opciones) => request(RUTA, opciones);

export const getLocal = (id, opciones) => request(`${RUTA}/${id}`, opciones);

/* Panel de administración: { numero, horarioApertura, horarioCierre, mesas: [{ capacidad, cantidad }], reservaMaxPersonas } */
export const updateLocal = (id, datos) => request(`${RUTA}/${id}`, { method: 'PUT', body: datos });
