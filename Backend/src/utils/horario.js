/*
 * Horarios de los locales, siempre en hora de Buenos Aires: es la hora en la que abren los salones,
 * sin importar dónde corra el servidor.
 */
const ZONA = 'America/Argentina/Buenos_Aires';
const MINUTOS_POR_DIA = 1440;
const ULTIMO_TURNO_ANTES_DEL_CIERRE = 60;

const formateador = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONA,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
});

export const aMinutos = (hora) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
};

/* Minutos transcurridos desde la medianoche de Buenos Aires */
export const minutosDelDia = (fecha) => {
    const partes = Object.fromEntries(formateador.formatToParts(fecha).map(({ type, value }) => [type, value]));
    return Number(partes.hour) * 60 + Number(partes.minute);
};

export const tieneHorario = ({ horarioApertura, horarioCierre }) => Boolean(horarioApertura && horarioCierre);

/* Ventana de apertura en minutos; si cierra pasada la medianoche, el cierre supera los 1440 */
const ventana = ({ horarioApertura, horarioCierre }) => {
    const apertura = aMinutos(horarioApertura);
    let cierre = aMinutos(horarioCierre);
    if (cierre <= apertura) cierre += MINUTOS_POR_DIA;
    return { apertura, cierre };
};

/* ¿El local está abierto en ese instante? Un local sin horario cargado no bloquea nada. */
export const estaAbierto = (local, fecha = new Date()) => {
    if (!tieneHorario(local)) return true;

    const { apertura, cierre } = ventana(local);
    const minutos = minutosDelDia(fecha);

    return (minutos >= apertura && minutos < cierre) || (minutos + MINUTOS_POR_DIA >= apertura && minutos + MINUTOS_POR_DIA < cierre);
};

/* ¿La reserva cae entre la apertura y una hora antes del cierre? Sin horario cargado, siempre. */
export const esHorarioDeReserva = (local, fecha) => {
    if (!tieneHorario(local)) return true;

    const { apertura, cierre } = ventana(local);
    const ultimo = cierre - ULTIMO_TURNO_ANTES_DEL_CIERRE;
    const minutos = minutosDelDia(fecha);

    return (minutos >= apertura && minutos <= ultimo) || (minutos + MINUTOS_POR_DIA >= apertura && minutos + MINUTOS_POR_DIA <= ultimo);
};

export const HORA_VALIDA = /^([01]\d|2[0-3]):[0-5]\d$/;
