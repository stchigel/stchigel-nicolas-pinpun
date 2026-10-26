/*
 * Combos armados solos: si el pedido trae por separado lo que compone un combo (un café con leche y tres medialunas),
 * esos renglones se reemplazan por el combo, que cuesta lo mismo o menos. Es la misma regla que aplica el servidor
 * al recibir el pedido (Backend/src/utils/combos.js): lo que ve el cliente es lo que se le cobra.
 *
 * `items` son los renglones del pedido; `combos` son los platos de tipo combo de la carta, con sus `componentes`
 * ({ productoId, variante, cantidad, precio }). Devuelve renglones nuevos (los de entrada no se tocan) y qué combos se armaron.
 * Los combos que cuestan más que sus partes por separado no se arman: nunca se cobra de más.
 * Si se pisan dos combos que comparten un componente, gana el que más ahorra.
 */
const mismoComponente = (item, componente) =>
    Number(item.productoId) === componente.productoId && (item.variante ?? '') === (componente.variante ?? '');

const cantidadDe = (items, componente) =>
    items.filter((item) => mismoComponente(item, componente)).reduce((suma, item) => suma + item.cantidad, 0);

const precioSeparado = (combo) => combo.componentes.reduce((suma, componente) => suma + componente.precio * componente.cantidad, 0);

/* Saca `cantidad` unidades de un componente de los renglones, empezando por el primero que lo tenga */
const consumir = (items, componente, cantidad) => {
    let restante = cantidad;

    return items.flatMap((item) => {
        if (restante === 0 || !mismoComponente(item, componente)) return [item];

        const sacadas = Math.min(item.cantidad, restante);
        restante -= sacadas;

        return item.cantidad > sacadas ? [{ ...item, cantidad: item.cantidad - sacadas }] : [];
    });
};

/* El renglón del pedido para un combo, igual al que se arma al sumarlo desde la carta */
export const renglonDeCombo = (combo, cantidad) => ({
    clave: String(combo.id),
    productoId: combo.id,
    cartaId: combo.cartaId,
    nombre: combo.nombre,
    categoria: combo.categoria,
    subcategoria: combo.subcategoria,
    variante: '',
    precio: combo.precio,
    cantidad,
    componentes: combo.componentes.map(({ nombre, cantidad: unidades }) => ({ nombre, cantidad: unidades }))
});

export function formarCombos(items, combos, { excluidos = [] } = {}) {
    const candidatos = combos
        .filter((combo) => combo.componentes.length > 0 && !excluidos.includes(combo.id))
        .map((combo) => ({ combo, ahorro: precioSeparado(combo) - combo.precio }))
        .filter(({ ahorro }) => ahorro >= 0)
        .sort((a, b) => b.ahorro - a.ahorro || b.combo.componentes.length - a.combo.componentes.length || a.combo.id - b.combo.id);

    let renglones = items.map((item) => ({ ...item }));
    const armados = [];

    for (const { combo, ahorro } of candidatos) {
        const veces = Math.min(...combo.componentes.map((componente) => Math.floor(cantidadDe(renglones, componente) / componente.cantidad)));
        if (!(veces >= 1)) continue;

        /* Lo que se junta en el combo, para poder devolverlo si el cliente no lo quiere */
        const partes = combo.componentes.map((componente) => ({
            ...renglones.find((item) => mismoComponente(item, componente)),
            cantidad: veces * componente.cantidad
        }));

        for (const componente of combo.componentes) renglones = consumir(renglones, componente, veces * componente.cantidad);

        const existente = renglones.find((item) => Number(item.productoId) === combo.id);
        if (existente) existente.cantidad += veces;
        else renglones.push(renglonDeCombo(combo, veces));

        armados.push({ combo, veces, ahorro: ahorro * veces, partes });
    }

    return { items: renglones, armados };
}

/* "Café con leche + 3 Medialuna": de qué se compone un combo, para mostrarlo debajo de su nombre */
export const describirComponentes = (componentes) =>
    componentes.map(({ nombre, cantidad }) => (cantidad > 1 ? `${cantidad} ${nombre}` : nombre)).join(' + ');
