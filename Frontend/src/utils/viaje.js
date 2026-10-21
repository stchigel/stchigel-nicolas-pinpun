/* Tiempos y distancias del viaje de un delivery, tal como los lee el cliente */

/* Cuándo salió el repartidor: el último paso "En camino" del recorrido del pedido */
export function inicioDelViaje(historial) {
    return historial.findLast((paso) => paso.estado === 'En camino')?.fecha ?? null;
}

/* "menos de 1 min", "8 min", "1 h 5 min" */
export function formatearDuracion(segundos) {
    const minutos = Math.round(segundos / 60);
    if (minutos < 1) return 'menos de 1 min';
    if (minutos < 60) return `${minutos} min`;

    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}

/* "350 m", "2,4 km" */
export function formatearMetros(metros) {
    if (metros < 1000) return `${Math.max(10, Math.round(metros / 10) * 10)} m`;
    return `${(metros / 1000).toLocaleString('es-AR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
}

/*
 * Cuánto falta según el último recorrido calculado, descontando lo que ya pasó desde que se calculó
 * (el servidor lo recalcula cada pocos segundos mientras el repartidor se mueve).
 */
export function segundosRestantes(ruta, ahora) {
    const transcurrido = Math.max(0, (ahora - new Date(ruta.calculadaEn).getTime()) / 1000);
    return Math.max(0, ruta.duracionS - transcurrido);
}

/* "20:41": la hora estimada de llegada */
export function horaEstimada(segundos, ahora) {
    return new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(ahora + segundos * 1000));
}
