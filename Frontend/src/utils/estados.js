/*
 * Circuitos de estados de pedidos y reservas (los mismos que valida el backend).
 * Un pedido avanza al siguiente estado de su circuito o se cancela; una reserva se acepta o se rechaza.
 */
export const CANCELADO = 'Cancelado';

export const ESTADOS_PEDIDO = {
    delivery: ['Recibido', 'En preparación', 'Listo', 'En camino', 'Entregado'],
    retiro: ['Recibido', 'En preparación', 'Listo', 'Retirado']
};

export const ETIQUETA_TIPO = { retiro: 'Retiro', delivery: 'Delivery' };

/* El estado al que sigue un pedido, o null si ya terminó o se canceló */
export function siguienteEstadoPedido(pedido) {
    if (pedido.estado === CANCELADO) return null;

    const circuito = ESTADOS_PEDIDO[pedido.tipo];
    return circuito[circuito.indexOf(pedido.estado) + 1] ?? null;
}

export const pedidoActivo = (pedido) => siguienteEstadoPedido(pedido) !== null;

export const ESPERANDO = 'Esperando confirmación';
export const ACEPTADA = 'Aceptada';
export const RECHAZADA = 'Rechazada';
export const CONCLUIDA = 'Concluida';

export const reservaActiva = (reserva) => reserva.estado === ESPERANDO || reserva.estado === ACEPTADA;

/* El estado "bueno" al que puede pasar una reserva, con el verbo del botón que lo hace */
export const ACCION_RESERVA = {
    [ESPERANDO]: { estado: ACEPTADA, verbo: 'Aceptar' },
    [ACEPTADA]: { estado: CONCLUIDA, verbo: 'Marcar como concluida' }
};

/* Lo que dice el botón que lleva un pedido al estado siguiente */
export const VERBO_PEDIDO = {
    'En preparación': 'Empezar a preparar',
    Listo: 'Marcar como listo',
    'En camino': 'Sale a reparto',
    Entregado: 'Marcar como entregado',
    Retirado: 'Marcar como retirado'
};
