import { formatearPrecio } from './formato.js';

/*
 * La carta como escenas: cada barra de la carta lleva una foto de lo que se ve desde el mostrador
 * de Corrientes. Las del salón comparten foto y cambian de encuadre (punto de origen y acercamiento),
 * así la mitad fija se mueve por el local en lugar de repetir la misma imagen.
 * Las categorías que lleguen de la API y no estén acá se suman al final con la foto del salón.
 */
export const ESCENA_PORTADA = {
    id: 'portada',
    titulo: 'El salón de Corrientes',
    foto: 'salon',
    encuadre: { origen: '50% 45%', escala: 1 }
};

export const ESCENAS = [
    { id: 'pizzas', titulo: 'Pizzas', categorias: ['Pizzas'], foto: 'napolitana', encuadre: { origen: '50% 50%', escala: 1 } },
    { id: 'empanadas', titulo: 'Empanadas', categorias: ['Empanadas'], foto: 'empanada-carne', encuadre: { origen: '50% 50%', escala: 1 } },
    { id: 'postres', titulo: 'Postres y helados', categorias: ['Postres', 'Copas heladas'], foto: 'salon', encuadre: { origen: '25% 55%', escala: 1.45 } },
    { id: 'cafeteria', titulo: 'Cafetería', categorias: ['Cafetería', 'Pastelería'], foto: 'salon', encuadre: { origen: '95% 95%', escala: 1.6 } },
    { id: 'bebidas', titulo: 'Bebidas sin alcohol', categorias: ['Bebidas', 'Licuados'], foto: 'salon', encuadre: { origen: '85% 12%', escala: 1.7 } },
    { id: 'cervezas', titulo: 'Cervezas', categorias: ['Cervezas'], foto: 'salon', encuadre: { origen: '5% 18%', escala: 1.6 } },
    { id: 'vinos', titulo: 'Vinos y espumantes', categorias: ['Vinos', 'Champagne y sidra'], foto: 'salon', encuadre: { origen: '45% 35%', escala: 1.55 } },
    {
        id: 'aperitivos',
        titulo: 'Aperitivos y licores',
        categorias: ['Aperitivos', 'Licores', 'Whisky nacional', 'Coñac', 'Tragos'],
        foto: 'salon',
        encuadre: { origen: '85% 72%', escala: 1.5 }
    }
];

/* Atajos de la portada */
export const ATAJOS_ESCENAS = ['pizzas', 'empanadas', 'bebidas'];

const idDe = (texto) =>
    texto
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

const preciosDe = (producto) =>
    producto.variantes?.length > 0 ? producto.variantes.map((variante) => variante.precio) : [producto.precio];

/*
 * Un tramo es un bloque de la barra con su título (subcategoría o categoría).
 * Si todos sus platos vienen en tamaños, se arma como tabla con un tamaño por columna.
 */
function armarTramo(titulo, items) {
    const enTabla = items.every((item) => item.variantes?.length > 0);
    const tamanos = enTabla ? [...new Set(items.flatMap((item) => item.variantes.map((variante) => variante.nombre)))] : [];
    return { id: idDe(`${titulo || 'tramo'}-${items[0].id}`), titulo, items, tamanos };
}

function armarEscena(escena, productos) {
    const variasCategorias = escena.categorias.length > 1;
    const tramos = new Map();

    productos.forEach((producto) => {
        const titulo = producto.subcategoria || (variasCategorias ? producto.categoria : '');
        const clave = `${producto.categoria}|${titulo}`;
        if (!tramos.has(clave)) tramos.set(clave, { titulo, items: [] });
        tramos.get(clave).items.push(producto);
    });

    const precios = productos.flatMap(preciosDe);
    const cantidad = productos.length;

    return {
        ...escena,
        tramos: [...tramos.values()].map(({ titulo, items }) => armarTramo(titulo, items)),
        resumen: `${cantidad} ${cantidad === 1 ? 'opción' : 'opciones'}, desde ${formatearPrecio(Math.min(...precios))}`
    };
}

export function armarEscenas(productos) {
    const porCategoria = new Map();
    productos.forEach((producto) => {
        if (!porCategoria.has(producto.categoria)) porCategoria.set(producto.categoria, []);
        porCategoria.get(producto.categoria).push(producto);
    });

    const conocidas = new Set(ESCENAS.flatMap((escena) => escena.categorias));
    const extras = [...porCategoria.keys()]
        .filter((categoria) => !conocidas.has(categoria))
        .map((categoria) => ({
            id: idDe(categoria),
            titulo: categoria,
            categorias: [categoria],
            foto: 'salon',
            encuadre: ESCENA_PORTADA.encuadre
        }));

    return [...ESCENAS, ...extras]
        .map((escena) => {
            const lista = escena.categorias.flatMap((categoria) => porCategoria.get(categoria) ?? []);
            return lista.length > 0 ? armarEscena(escena, lista) : null;
        })
        .filter(Boolean);
}

/* Pizzas que se pueden partir mitad y mitad en un tamaño dado */
export const pizzasEnTamano = (productos, tamano) =>
    productos.filter(
        (producto) => producto.categoria === 'Pizzas' && producto.variantes?.some((variante) => variante.nombre === tamano)
    );

export const precioEnTamano = (producto, tamano) =>
    producto.variantes.find((variante) => variante.nombre === tamano)?.precio ?? 0;
