const aMinutos = (hora) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
};

export const tieneHorario = ({ horarioApertura, horarioCierre }) => Boolean(horarioApertura && horarioCierre);

/*
 * Indica si un local está abierto en la fecha dada.
 * Contempla horarios que cruzan la medianoche (por ejemplo de 12:00 a 00:30).
 */
export function estaAbierto(local, fecha = new Date()) {
    if (!tieneHorario(local)) return false;

    const { horarioApertura, horarioCierre } = local;

    const ahora = fecha.getHours() * 60 + fecha.getMinutes();
    const apertura = aMinutos(horarioApertura);
    const cierre = aMinutos(horarioCierre);

    if (cierre > apertura) return ahora >= apertura && ahora < cierre;
    return ahora >= apertura || ahora < cierre;
}

/* Cómo está el local ahora, en pocas palabras */
export function textoEstado(local) {
    if (!tieneHorario(local)) return 'Horario a confirmar';
    return estaAbierto(local) ? 'Abierto ahora' : 'Cerrado ahora';
}

export function describirHorario(local, fecha = new Date()) {
    if (!tieneHorario(local)) return 'Horario a confirmar';

    return estaAbierto(local, fecha)
        ? `Abierto, cierra ${local.horarioCierre} h`
        : `Cerrado, abre ${local.horarioApertura} h`;
}
