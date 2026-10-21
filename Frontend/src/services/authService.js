import { request } from './api.js';

const RUTA = '/auth';

/* Devuelve { token, usuario: { mail, nombre, apellido, rol, localId } } */
export const login = (mail, contrasena) => request(`${RUTA}/login`, { method: 'POST', body: { mail, contrasena } });

export const getSesion = (opciones) => request(`${RUTA}/me`, opciones);
