import { randomBytes } from 'node:crypto';

/*
 * Pedido de retiro o delivery.
 * - `items` guarda cada producto como estaba en la carta al pedir (nombre, variante, precio y cantidad).
 * - `historial` anota cada estado por el que pasó, con su fecha (y el motivo, si se canceló con uno).
 * - `repartidorId` es quién lleva un delivery (null mientras no tenga asignado) y `asignadoEn`, desde cuándo.
 * - `codigoSeguimiento` es el código largo e inadivinable del enlace con el que el cliente sigue su pedido.
 * - `destino` son las coordenadas de la dirección de un delivery ({ latitud, longitud }); se completa en segundo plano
 *   y queda en null si la dirección no se pudo ubicar. `destinoIntentadoEn` evita buscarla más de una vez por minuto.
 */
class Pedido {
    constructor({ id, fecha, total, tipo, estado, localId, cliente, direccion = '', items, historial, repartidorId = null, asignadoEn = null, codigoSeguimiento, destino = null }) {
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
        this.codigoSeguimiento = codigoSeguimiento ?? randomBytes(16).toString('base64url');
        this.destino = destino;
        this.destinoIntentadoEn = null;
    }
}

export default Pedido;
