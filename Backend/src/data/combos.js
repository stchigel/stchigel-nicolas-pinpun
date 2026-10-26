/*
 * Los platos de las cartas que en realidad son combos: se arman con otros platos de la misma carta.
 * Cada componente se busca por categoría y nombre (y subcategoría, si hace falta para distinguirlo).
 * Si falta el combo o alguno de sus componentes en una carta, ese combo se saltea en esa carta.
 * No están acá los que llevan algo que no es un plato de la carta (el pan y manteca, las facturas o la medialuna rellena del Good Morning).
 */
const CORRIENTES = 'Carta de Corrientes';
const ANGELINA = ['Delivery Angelina', 'Salón Angelina'];

const componente = (categoria, nombre, cantidad = 1) => ({ categoria, nombre, cantidad });

export const COMBOS = [
    {
        cartas: [CORRIENTES],
        categoria: 'Cafetería',
        nombre: 'Café con leche con 3 medialunas',
        componentes: [componente('Cafetería', 'Café con leche'), componente('Pastelería', 'Medialuna', 3)]
    },
    {
        cartas: ANGELINA,
        categoria: 'Cafetería',
        nombre: 'Café con leche con 3 medialunas',
        componentes: [componente('Cafetería', 'Café con leche'), componente('Cafetería', 'Medialunas', 3)]
    },
    {
        cartas: ANGELINA,
        categoria: 'Cafetería',
        nombre: 'Desayuno',
        componentes: [componente('Cafetería', 'Café con leche'), componente('Cafetería', 'Tostadas, pan a elección'), componente('Cafetería', 'Para untar')]
    }
];
