/*
 * Circuitos de estados (ver PRODUCT.md). Cada pedido o reserva avanza al siguiente estado de su lista
 * o se corta en el estado de cierre negativo: Cancelado para los pedidos, Rechazada para las reservas.
 */
export const TipoPedido = Object.freeze({
    RETIRO: 'retiro',
    DELIVERY: 'delivery'
});

export const CANCELADO = 'Cancelado';

export const ESTADOS_PEDIDO = Object.freeze({
    [TipoPedido.DELIVERY]: ['Recibido', 'En preparación', 'Listo', 'En camino', 'Entregado'],
    [TipoPedido.RETIRO]: ['Recibido', 'En preparación', 'Listo', 'Retirado']
});

export const EstadoReserva = Object.freeze({
    ESPERANDO: 'Esperando confirmación',
    ACEPTADA: 'Aceptada',
    RECHAZADA: 'Rechazada',
    CONCLUIDA: 'Concluida'
});

/* Estados a los que puede pasar una reserva desde cada uno */
export const TRANSICIONES_RESERVA = Object.freeze({
    [EstadoReserva.ESPERANDO]: [EstadoReserva.ACEPTADA, EstadoReserva.RECHAZADA],
    [EstadoReserva.ACEPTADA]: [EstadoReserva.CONCLUIDA, EstadoReserva.RECHAZADA],
    [EstadoReserva.RECHAZADA]: [],
    [EstadoReserva.CONCLUIDA]: []
});

/* Estados de una reserva que ocupan lugar en el salón */
export const RESERVA_OCUPA_LUGAR = Object.freeze([EstadoReserva.ESPERANDO, EstadoReserva.ACEPTADA]);
