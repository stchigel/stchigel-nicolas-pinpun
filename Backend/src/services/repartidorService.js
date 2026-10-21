import usuarioRepository from '../repositories/usuarioRepository.js';
import localService from './localService.js';
import { cargaDe } from './pedidoService.js';
import { ConflictError, NotFoundError } from '../exceptions/AppError.js';
import { Messages } from '../enums/Messages.js';
import { Rol } from './authService.js';
import { exigirLocal, localDelListado } from '../utils/permisos.js';

/* Lo que se muestra de un repartidor: sin contraseña y con cuántos pedidos sin terminar lleva */
const aPublico = (repartidor) => ({
    id: repartidor.id,
    nombre: repartidor.nombre,
    apellido: repartidor.apellido,
    mail: repartidor.mail,
    numero: repartidor.numero,
    localId: repartidor.local,
    activo: repartidor.activo,
    pedidosEnCurso: cargaDe(repartidor.id)
});

const buscar = (id, usuario) => {
    const repartidor = usuarioRepository.findRepartidorById(id);
    if (!repartidor) throw new NotFoundError(Messages.REPARTIDOR_NOT_FOUND);
    exigirLocal(usuario, repartidor.local);

    return repartidor;
};

/* La sucursal ve solo sus repartidores; la administración general, los de todas o los del local que elija */
const getAll = ({ localId }, usuario) =>
    usuarioRepository.findRepartidores({ localId: localDelListado(usuario, localId) }).map(aPublico);

/* La sucursal crea repartidores para su local; la general, para el que indique */
const create = ({ localId, mail, ...datos }, usuario) => {
    const destino = usuario.rol === Rol.SUCURSAL ? usuario.localId : localId;
    localService.getById(destino);

    if (usuarioRepository.findByMail(mail)) throw new ConflictError(Messages.MAIL_EN_USO);

    return aPublico(usuarioRepository.createRepartidor({ ...datos, mail: mail.toLowerCase(), localId: destino }));
};

/* No se desactiva una cuenta que todavía lleva pedidos: primero se reasignan */
const update = (id, datos, usuario) => {
    const repartidor = buscar(id, usuario);

    if (!datos.activo && repartidor.activo && cargaDe(repartidor.id) > 0) throw new ConflictError(Messages.REPARTIDOR_CON_PEDIDOS);

    return aPublico(usuarioRepository.updateRepartidor(id, datos));
};

export default { getAll, create, update };
