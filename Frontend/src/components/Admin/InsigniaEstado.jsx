/* El estado de un pedido o una reserva, con el color de su momento en el circuito */
const TONO = {
    Recibido: 'nuevo',
    'Esperando confirmación': 'nuevo',
    'En preparación': 'trabajando',
    Aceptada: 'trabajando',
    Listo: 'listo',
    'En camino': 'listo',
    Entregado: 'cerrado',
    Retirado: 'cerrado',
    Concluida: 'cerrado',
    Cancelado: 'caido',
    Rechazada: 'caido'
};

function InsigniaEstado({ estado }) {
    return (
        <span className="insignia" data-tono={TONO[estado] ?? 'nuevo'}>
            {estado}
        </span>
    );
}

export default InsigniaEstado;
