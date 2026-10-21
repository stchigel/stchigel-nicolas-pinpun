import { leerToken } from '../utils/almacenamientoSesion.js';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const MENSAJE_SIN_CONEXION = 'No pudimos conectarnos con Pin Pun. Revisá tu conexión e intentá de nuevo.';
const MENSAJE_GENERICO = 'Algo salió mal. Intentá de nuevo en unos minutos.';

/* El panel registra acá qué hacer cuando el servidor dice que la sesión ya no vale */
let alVencerSesion = null;

export const registrarSesionVencida = (manejador) => {
    alVencerSesion = manejador;
};

/*
 * Realiza una petición a la API y devuelve el campo `data` de la respuesta.
 * El backend responde siempre { success, data } o { success: false, message },
 * así que cualquier respuesta incorrecta se convierte en un Error con ese mensaje.
 * Si hay una sesión iniciada, el token viaja en cada petición.
 */
export async function request(ruta, { method = 'GET', body, signal } = {}) {
    const token = leerToken();
    const headers = {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    let response;

    try {
        response = await fetch(`${API_URL}${ruta}`, {
            method,
            signal,
            headers: Object.keys(headers).length > 0 ? headers : undefined,
            body: body ? JSON.stringify(body) : undefined
        });
    } catch (error) {
        if (error.name === 'AbortError') throw error;
        throw new Error(MENSAJE_SIN_CONEXION);
    }

    const contenido = await response.json().catch(() => null);

    if (!response.ok || !contenido?.success) {
        if (response.status === 401 && token) alVencerSesion?.();
        throw new Error(contenido?.message ?? MENSAJE_GENERICO);
    }

    return contenido.data;
}
