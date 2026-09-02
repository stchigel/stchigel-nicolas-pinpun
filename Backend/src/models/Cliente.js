import Usuario from './Usuario.js';

class Cliente extends Usuario {
    constructor(dni, nombre, apellido, mail, numero, direccion, contrasena) {
        super(dni, nombre, apellido, mail, numero, direccion, contrasena);
    }
}

export default Cliente;
