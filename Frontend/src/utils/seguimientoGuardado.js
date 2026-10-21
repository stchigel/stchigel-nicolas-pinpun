const CLAVE = 'pinpun:seguimientos';
const MAXIMO = 5;

/*
 * Los códigos de seguimiento de los últimos pedidos hechos desde este navegador, del más nuevo al más viejo.
 * Sirven para volver a ver el pedido sin tener que guardar el enlace. Si el almacenamiento no está disponible,
 * el enlace de la pantalla "Pedido enviado" sigue funcionando igual.
 */
export function leerSeguimientos() {
    try {
        const guardados = JSON.parse(localStorage.getItem(CLAVE));
        return Array.isArray(guardados) ? guardados : [];
    } catch {
        return [];
    }
}

export function guardarSeguimiento(codigo) {
    try {
        const sinRepetir = leerSeguimientos().filter((guardado) => guardado !== codigo);
        localStorage.setItem(CLAVE, JSON.stringify([codigo, ...sinRepetir].slice(0, MAXIMO)));
    } catch {
        /* Sin almacenamiento: no se recuerda el pedido */
    }
}
