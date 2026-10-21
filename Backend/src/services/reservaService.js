import reservaRepository from '../repositories/reservaRepository.js';
import localService from './localService.js';
import { BadRequestError, ConflictError, NotFoundError } from '../exceptions/AppError.js';
import { EstadoReserva, RESERVA_OCUPA_LUGAR, TRANSICIONES_RESERVA } from '../enums/Estados.js';
import { Messages } from '../enums/Messages.js';
import { esHorarioDeReserva } from '../utils/horario.js';
import { hayLugar } from '../utils/mesas.js';
import { exigirLocal, localDelListado } from '../utils/permisos.js';

/* Cuánto ocupa una mesa una reserva: las que caen a menos de este tiempo entre sí comparten el salón */
const DURACION_RESERVA_MS = 2 * 60 * 60 * 1000;

const getAll = ({ localId, estado }, usuario) =>
    reservaRepository.findAll({ localId: localDelListado(usuario, localId), estado });

const getById = (id, usuario) => {
    const reserva = reservaRepository.findById(id);
    if (!reserva) throw new NotFoundError(Messages.RESERVA_NOT_FOUND);
    exigirLocal(usuario, reserva.localId);

    return reserva;
};

/*
 * Reglas del negocio: dentro del horario del local, hasta el máximo de personas por reserva
 * y con lugar en el salón entre las reservas que se superponen en el tiempo: si el local junta mesas cuenta la suma
 * de comensales; si no, cada grupo tiene que entrar en una sola mesa.
 */
const create = ({ localId, fechaHora, cantPersonas, cliente, aclaraciones }) => {
    const local = localService.getById(localId);
    const fecha = new Date(fechaHora);

    if (Number.isNaN(fecha.getTime()) || fecha.getTime() <= Date.now()) throw new BadRequestError(Messages.INVALID_FECHA_HORA);
    if (cantPersonas > local.maximoPorReserva) {
        throw new BadRequestError(local.juntarMesas || local.mayorMesa >= local.reservaMaxPersonas ? Messages.INVALID_CANT_PERSONAS : Messages.SIN_MESA_PARA_EL_GRUPO);
    }
    if (!esHorarioDeReserva(local, fecha)) throw new ConflictError(Messages.RESERVA_FUERA_DE_HORARIO);

    const superpuestas = reservaRepository
        .findAll({ localId })
        .filter((reserva) => RESERVA_OCUPA_LUGAR.includes(reserva.estado))
        .filter((reserva) => Math.abs(new Date(reserva.fechaHora).getTime() - fecha.getTime()) < DURACION_RESERVA_MS)
        .map((reserva) => reserva.cantPersonas);

    if (!hayLugar(local.mesas, local.juntarMesas, [...superpuestas, cantPersonas])) throw new ConflictError(Messages.SIN_LUGAR);

    return reservaRepository.create({
        fechaHora: fecha.toISOString(),
        cantPersonas,
        estado: EstadoReserva.ESPERANDO,
        localId,
        cliente,
        aclaraciones,
        creada: new Date().toISOString()
    });
};

const cambiarEstado = (id, estado, usuario) => {
    const reserva = getById(id, usuario);

    if (!Object.values(EstadoReserva).includes(estado)) throw new BadRequestError(Messages.INVALID_ESTADO);
    if (!TRANSICIONES_RESERVA[reserva.estado].includes(estado)) throw new ConflictError(Messages.TRANSICION_INVALIDA);

    return reservaRepository.cambiarEstado(id, estado);
};

export default { getAll, getById, create, cambiarEstado };
