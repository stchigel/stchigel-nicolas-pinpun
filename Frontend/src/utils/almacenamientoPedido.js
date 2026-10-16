const CLAVE = 'pinpun:pedido';

/*
 * El pedido se guarda en el navegador. Si el almacenamiento no está disponible
 * (navegación privada, permisos) se sigue usando en memoria sin romper nada.
 */
export function leerPedidoGuardado() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE));
        return Array.isArray(guardado) ? guardado : [];
    } catch {
        return [];
    }
}

export function guardarPedido(items) {
    try {
        localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
        /* Sin almacenamiento: el pedido vive solo mientras la pestaña esté abierta */
    }
}
