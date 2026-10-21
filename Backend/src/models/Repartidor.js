import Usuario from './Usuario.js';

/*
 * Repartidor de una sucursal. Entra al portal de reparto con su cuenta y ve solo los pedidos que le asignaron.
 * - `local` es el id de la sucursal a la que pertenece.
 * - `activo` en false desactiva la cuenta sin perder su historial.
 */
class Repartidor extends Usuario {
    constructor(id, dni, nombre, apellido, mail, numero, direccion, contrasena, local, activo = true) {
        super(dni, nombre, apellido, mail, numero, direccion, contrasena);
        this.id = id;
        this.local = local;
        this.activo = activo;
    }
}

export default Repartidor;
