const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

const MENSAJE_SIN_CONEXION = 'No pudimos conectarnos con Pin Pun. Revisá tu conexión e intentá de nuevo.';
const MENSAJE_GENERICO = 'Algo salió mal. Intentá de nuevo en unos minutos.';

/*
 * Realiza una petición a la API y devuelve el campo `data` de la respuesta.
 * El backend responde siempre { success, data } o { success: false, message },
 * así que cualquier respuesta incorrecta se convierte en un Error con ese mensaje.
 */
export async function request(ruta, { method = 'GET', body, signal } = {}) {
    let response;

    try {
        response = await fetch(`${API_URL}${ruta}`, {
            method,
            signal,
            headers: body ? { 'Content-Type': 'application/json' } : undefined,
            body: body ? JSON.stringify(body) : undefined
        });
    } catch (error) {
        if (error.name === 'AbortError') throw error;
        throw new Error(MENSAJE_SIN_CONEXION);
    }

    const contenido = await response.json().catch(() => null);

    if (!response.ok || !contenido?.success) {
        throw new Error(contenido?.message ?? MENSAJE_GENERICO);
    }

    return contenido.data;
}
