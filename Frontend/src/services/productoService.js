import { request } from './api.js';

const RUTA = '/productos';

export const getProductos = (opciones) => request(RUTA, opciones);

export const getProductosDestacados = (opciones) => request(`${RUTA}?destacado=true`, opciones);

export const getProducto = (id, opciones) => request(`${RUTA}/${id}`, opciones);

export const createProducto = (producto) => request(RUTA, { method: 'POST', body: producto });

export const updateProducto = (id, producto) => request(`${RUTA}/${id}`, { method: 'PUT', body: producto });

export const deleteProducto = (id) => request(`${RUTA}/${id}`, { method: 'DELETE' });
