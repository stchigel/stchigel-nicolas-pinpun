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

/* Un pedido terminó si llegó al último estado de su circuito o se canceló */
export const estaTerminado = (pedido) => pedido.estado === CANCELADO || pedido.estado === ESTADOS_PEDIDO[pedido.tipo].at(-1);

/* Lo que puede marcar un repartidor en los pedidos que le asignaron: salir, entregar o no poder entregar */
export const ESTADOS_DEL_REPARTIDOR = Object.freeze(['En camino', 'Entregado', CANCELADO]);

/* Y solo puede cancelar un pedido que ya tiene en la mano; mientras está en cocina decide la sucursal */
export const ESTADOS_CANCELABLES_POR_REPARTIDOR = Object.freeze(['Listo', 'En camino']);
