/*
 * Reserva de mesa. `fechaHora` es un instante en ISO; `estado` sigue el circuito de ESTADOS_RESERVA.
 */
class Reserva {
    constructor({ id, fechaHora, cantPersonas, estado, localId, cliente, aclaraciones = '', creada }) {
        this.id = id;
        this.fechaHora = fechaHora;
        this.cantPersonas = cantPersonas;
        this.estado = estado;
        this.localId = localId;
        this.cliente = cliente;
        this.aclaraciones = aclaraciones;
        this.creada = creada;
    }
}

export default Reserva;
