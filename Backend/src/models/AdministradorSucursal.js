import Usuario from './Usuario.js';

class AdministradorSucursal extends Usuario {
    constructor(dni, nombre, apellido, mail, numero, direccion, contrasena, local) {
        super(dni, nombre, apellido, mail, numero, direccion, contrasena);
        this.local = local;
    }
}

export default AdministradorSucursal;
