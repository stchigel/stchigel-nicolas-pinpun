const CLAVE_LOCAL = 'pinpun:sucursal';
const CLAVE_MODO = 'pinpun:modo';

export const MODOS = ['pedir', 'ver'];

/*
 * La sucursal elegida se recuerda entre visitas (es la del cliente, no cambia seguido).
 * Para qué viene (pedir o mirar la carta antes de ir) se recuerda solo mientras dure la pestaña:
 * en una visita nueva se vuelve a preguntar. Si el almacenamiento no está disponible
 * (navegación privada, permisos) todo sigue funcionando sin recordar nada.
 */
export function leerLocalGuardado() {
    try {
        const id = Number(localStorage.getItem(CLAVE_LOCAL));
        return Number.isInteger(id) && id > 0 ? id : null;
    } catch {
        return null;
    }
}

export function guardarLocal(id) {
    try {
        localStorage.setItem(CLAVE_LOCAL, String(id));
    } catch {
        /* Sin almacenamiento: la elección vale hasta que se recargue la página */
    }
}

export function leerModoGuardado() {
    try {
        const modo = sessionStorage.getItem(CLAVE_MODO);
        return MODOS.includes(modo) ? modo : null;
    } catch {
        return null;
    }
}

export function guardarModo(modo) {
    try {
        sessionStorage.setItem(CLAVE_MODO, modo);
    } catch {
        /* Ídem: se pregunta de nuevo al recargar */
    }
}
