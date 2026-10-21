const CLAVE = 'pinpun:sesion';

/*
 * El token del panel de administración se guarda en el navegador para sobrevivir a una recarga.
 * Si el almacenamiento no está disponible (navegación privada, permisos), la sesión dura lo que dure la pestaña.
 */
let enMemoria = null;

export function leerToken() {
    try {
        return localStorage.getItem(CLAVE) ?? enMemoria;
    } catch {
        return enMemoria;
    }
}

export function guardarToken(token) {
    enMemoria = token;
    try {
        localStorage.setItem(CLAVE, token);
    } catch {
        /* Sin almacenamiento: queda solo en memoria */
    }
}

export function borrarToken() {
    enMemoria = null;
    try {
        localStorage.removeItem(CLAVE);
    } catch {
        /* Nada que borrar */
    }
}
