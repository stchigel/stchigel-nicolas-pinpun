import { request } from './api.js';

const RUTA = '/productos';

/* Arma la query con los parámetros que tienen valor */
const consulta = (parametros) => {
    const query = new URLSearchParams();
    Object.entries(parametros).forEach(([clave, valor]) => {
        if (valor !== undefined && valor !== null) query.set(clave, valor);
    });

    const texto = query.toString();
    return texto ? `?${texto}` : '';
};

/*
 * Sin `localId` es la carta original, la de Corrientes (lo que edita el panel). Con `localId` y `canal` ('salon' o 'delivery')
 * es la carta que ese local usa en ese canal; con `cartaId`, una en particular. `tipo` ('simple' o 'combo') filtra por clase de plato.
 */
export const getProductos = ({ localId, canal, cartaId, tipo, ...opciones } = {}) =>
    request(`${RUTA}${consulta({ localId, canal, cartaId, tipo })}`, opciones);

export const getProductosDestacados = ({ localId, canal, ...opciones } = {}) =>
    request(`${RUTA}${consulta({ destacado: true, localId, canal })}`, opciones);

export const getProducto = (id, opciones) => request(`${RUTA}/${id}`, opciones);

export const createProducto = (producto) => request(RUTA, { method: 'POST', body: producto });

export const updateProducto = (id, producto) => request(`${RUTA}/${id}`, { method: 'PUT', body: producto });

export const deleteProducto = (id) => request(`${RUTA}/${id}`, { method: 'DELETE' });
