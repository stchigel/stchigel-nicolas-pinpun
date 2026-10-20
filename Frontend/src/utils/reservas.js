import { tieneHorario } from './horario.js';

/* Tope de personas del formulario: provisorio hasta que la API informe la capacidad de cada local */
export const MAXIMO_PERSONAS = 12;

const PASO_MINUTOS = 30;
const ANTICIPACION_MINUTOS = 30;
const ULTIMO_TURNO_ANTES_DEL_CIERRE = 60;
const MINUTOS_POR_DIA = 1440;

const dosDigitos = (numero) => String(numero).padStart(2, '0');

export const aMinutos = (hora) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
};

/* 1290 → "21:30"; pasada la medianoche vuelve a empezar (1500 → "01:00") */
export const aHora = (minutos) => {
    const delDia = minutos % MINUTOS_POR_DIA;
    return `${dosDigitos(Math.floor(delDia / 60))}:${dosDigitos(delDia % 60)}`;
};

/* Fecha local en el formato de <input type="date">: "2026-10-24" */
export const fechaISO = (fecha = new Date()) =>
    `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;

/* El momento exacto de una reserva: el día elegido más los minutos desde su medianoche */
export function fechaHoraDe(fechaIso, minutos) {
    const [anio, mes, dia] = fechaIso.split('-').map(Number);
    return new Date(anio, mes - 1, dia, 0, minutos);
}

/* "martes 20 de octubre": sin la coma que pone Intl, para que se lea seguido en una frase */
export const formatearFecha = (fechaIso) =>
    new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
        .format(fechaHoraDe(fechaIso, 0))
        .replace(',', '');

/*
 * Horarios que se ofrecen para reservar en un local: cada media hora desde que abre
 * hasta una hora antes de que cierre. Si el local cierra pasada la medianoche, los últimos turnos
 * son de la madrugada del día siguiente. Para hoy se descartan los que empiezan en menos de media hora.
 * Un local sin horario cargado no ofrece turnos: ahí la hora se escribe a mano.
 */
export function horariosDeReserva(local, fechaIso, ahora = new Date()) {
    if (!tieneHorario(local)) return [];

    const apertura = aMinutos(local.horarioApertura);
    let cierre = aMinutos(local.horarioCierre);
    if (cierre <= apertura) cierre += MINUTOS_POR_DIA;

    const desde = ahora.getTime() + ANTICIPACION_MINUTOS * 60000;
    const turnos = [];

    for (let minutos = apertura; minutos <= cierre - ULTIMO_TURNO_ANTES_DEL_CIERRE; minutos += PASO_MINUTOS) {
        if (fechaHoraDe(fechaIso, minutos).getTime() >= desde) {
            turnos.push({ minutos, hora: aHora(minutos), madrugada: minutos >= MINUTOS_POR_DIA });
        }
    }

    return turnos;
}
