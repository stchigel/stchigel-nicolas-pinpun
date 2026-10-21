/*
 * Pedido de retiro o delivery.
 * - `items` guarda cada producto como estaba en la carta al pedir (nombre, variante, precio y cantidad).
 * - `historial` anota cada estado por el que pasó, con su fecha.
 */
class Pedido {
    constructor({ id, fecha, total, tipo, estado, localId, cliente, direccion = '', items, historial }) {
        this.id = id;
        this.fecha = fecha;
        this.total = total;
        this.tipo = tipo;
        this.estado = estado;
        this.localId = localId;
        this.cliente = cliente;
        this.direccion = direccion;
        this.items = items;
        this.historial = historial ?? [{ estado, fecha }];
    }
}

export default Pedido;
