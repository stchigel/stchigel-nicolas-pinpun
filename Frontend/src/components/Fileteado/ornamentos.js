import { voluta } from './geometria.js';

/*
 * Piezas del fileteado, calculadas una sola vez al cargar el módulo.
 * Cada voluta lleva su color: rojo para los trazos principales,
 * verde para las hojas y dorado para los brotes y las flores.
 */
const calcular = (lista) => lista.map(({ color, ...trazo }) => ({ color, ancho: trazo.ancho, ...voluta(trazo) }));

/* Esquina superior izquierda de un marco (las otras tres se obtienen espejando). */
export const ESQUINA = {
    viewBox: '0 0 170 170',
    flor: { cx: 13, cy: 13, r: 9 },
    volutas: calcular([
        { color: 'rojo', x: 18, y: 12, angulo: 0, largo: 200, curvaInicial: 0, curvaFinal: 0.13, ancho: 15, sentido: 1, exponente: 2.6 },
        { color: 'rojo', x: 12, y: 18, angulo: 90, largo: 200, curvaInicial: 0, curvaFinal: 0.13, ancho: 15, sentido: -1, exponente: 2.6 },
        { color: 'verde', x: 24, y: 22, angulo: 22, largo: 95, curvaInicial: 0.005, curvaFinal: 0.16, ancho: 10, sentido: 1, exponente: 2 },
        { color: 'verde', x: 22, y: 24, angulo: 68, largo: 95, curvaInicial: 0.005, curvaFinal: 0.16, ancho: 10, sentido: -1, exponente: 2 }
    ])
};

/* Mitad derecha del remate que va sobre los títulos; la izquierda es su espejo. */
export const REMATE = {
    viewBox: '-200 0 400 100',
    flor: { cx: 0, cy: 46, r: 11 },
    volutas: calcular([
        { color: 'rojo', x: 14, y: 46, angulo: -18, largo: 175, curvaInicial: 0.004, curvaFinal: 0.12, ancho: 14, sentido: 1, exponente: 2.5 },
        { color: 'verde', x: 30, y: 50, angulo: 22, largo: 95, curvaInicial: 0, curvaFinal: 0.15, ancho: 9, sentido: -1, exponente: 2.2 },
        { color: 'dorado', x: 64, y: 38, angulo: -95, largo: 50, curvaInicial: 0.02, curvaFinal: 0.2, ancho: 5.5, sentido: 1, exponente: 1.8 }
    ])
};
