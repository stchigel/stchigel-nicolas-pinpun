/*
 * Pedido de retiro o delivery.
 * - `items` guarda cada producto como estaba en la carta al pedir (nombre, variante, precio y cantidad).
 * - `historial` anota cada estado por el que pasó, con su fecha (y el motivo, si se canceló con uno).
 * - `repartidorId` es quién lleva un delivery (null mientras no tenga asignado) y `asignadoEn`, desde cuándo.
 */
class Pedido {
    constructor({ id, fecha, total, tipo, estado, localId, cliente, direccion = '', items, historial, repartidorId = null, asignadoEn = null }) {
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
        this.repartidorId = repartidorId;
        this.asignadoEn = asignadoEn;
    }
}

export default Pedido;
