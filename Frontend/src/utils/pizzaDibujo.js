/*
 * Qué lleva cada pizza para dibujarla, leído del nombre y la descripción de la carta.
 * Así cualquier pizza nueva que cargue el backend se dibuja sola con sus ingredientes.
 */
const normalizar = (texto = '') =>
    texto
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase();

export const slugPizza = (pizza) => normalizar(pizza.nombre).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

/* Ingrediente → cómo aparece escrito en la carta */
const PALABRAS = {
    tomate: /tomate al natural|rodajas de tomate/,
    provolone: /provolone/,
    acelga: /acelga/,
    jamon: /jamon/,
    longaniza: /longaniza|calabresa/,
    palmitos: /palmito/,
    anana: /anana/,
    roquefort: /roquefort/,
    morron: /morron/,
    huevo: /huevo/,
    anchoas: /anchoa/,
    cebolla: /cebolla|fugazza/,
    salsaGolf: /salsa golf/,
    ajo: /\bajo\b/,
    aceitunas: /aceituna/,
    oregano: /oregano/
};

export function ingredientesDe(pizza) {
    const nombre = normalizar(pizza.nombre);
    const descripcion = normalizar(pizza.descripcion);
    /* Lo que va adentro de una rellena no se ve desde arriba */
    const arriba = `${nombre} ${descripcion.split('rellena')[0]}`;

    let base = 'muzzarella';
    if (/acelga|pizza verde/.test(arriba)) base = 'verde';
    else if (/fugazza/.test(nombre)) base = 'fugazza';
    else if (!/muzzarella/.test(arriba) && /salsa de tomate/.test(arriba)) base = 'salsa';

    const ingredientes = Object.keys(PALABRAS).filter((clave) => PALABRAS[clave].test(arriba));

    return { base, salsa: /salsa de tomate/.test(arriba), ingredientes };
}
