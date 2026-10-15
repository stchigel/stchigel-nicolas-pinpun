import { request } from './api.js';

const RUTA = '/locales';

export const getLocales = (opciones) => request(RUTA, opciones);

export const getLocal = (id, opciones) => request(`${RUTA}/${id}`, opciones);
