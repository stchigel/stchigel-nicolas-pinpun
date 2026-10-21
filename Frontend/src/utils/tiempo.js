const MINUTO = 60 * 1000;
const HORA = 60 * MINUTO;

const formateadorHora = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
const formateadorDia = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
const formateadorCorto = new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'numeric' });

export const horaDe = (iso) => formateadorHora.format(new Date(iso));

/* "hace 4 min", "hace 2 h", "20/10": cuánto pasó desde un momento, a medida que el panel se va refrescando */
export function haceCuanto(iso, ahora = Date.now()) {
    const pasado = ahora - new Date(iso).getTime();
    if (pasado < MINUTO) return 'recién';
    if (pasado < HORA) return `hace ${Math.floor(pasado / MINUTO)} min`;
    if (pasado < 24 * HORA) return `hace ${Math.floor(pasado / HORA)} h`;
    return formateadorCorto.format(new Date(iso));
}

const aClaveDia = (fecha) =>
    `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;

export const claveDia = (iso) => aClaveDia(new Date(iso));

/* "Hoy", "Mañana", "Ayer" o "viernes 23 de octubre" */
export function etiquetaDia(iso, ahora = Date.now()) {
    const dia = claveDia(iso);
    const corrido = (dias) => aClaveDia(new Date(ahora + dias * 24 * HORA));

    if (dia === corrido(0)) return 'Hoy';
    if (dia === corrido(1)) return 'Mañana';
    if (dia === corrido(-1)) return 'Ayer';

    const texto = formateadorDia.format(new Date(iso));
    return texto.charAt(0).toUpperCase() + texto.slice(1).replace(',', '');
}
