/*
 * Cómo se arma la carta en pantalla a partir de los productos de la API.
 * Como en el boceto, cada sección junta dos columnas (una principal y una de acompañamiento).
 * Las categorías que lleguen de la API y no estén acá se agregan al final, de a dos.
 */
export const SECCIONES_CARTA = [
    { columnas: [['Pizzas'], ['Empanadas']], ancho: 'izquierda' },
    { columnas: [['Postres'], ['Copas heladas']], ancho: 'derecha' },
    { columnas: [['Cafetería'], ['Pastelería']], ancho: 'izquierda' },
    { columnas: [['Bebidas', 'Licuados'], ['Cervezas']], ancho: 'parejo' },
    { columnas: [['Vinos'], ['Aperitivos', 'Champagne y sidra']], ancho: 'izquierda' },
    { columnas: [['Licores'], ['Whisky nacional', 'Coñac', 'Tragos']], ancho: 'parejo' }
];

/* Atajos del índice: las categorías a las que más se salta */
export const INDICE_CARTA = ['Pizzas', 'Empanadas', 'Postres', 'Cafetería', 'Bebidas', 'Cervezas', 'Vinos', 'Licores'];

/* Aclaraciones que la carta impresa pone debajo del título */
export const NOTAS_CARTA = {
    Pizzas: ['Al molde, con muzzarella de Lácteos Vidal.', 'En las mitad y mitad se cobra el precio más alto.']
};

export const idCategoria = (nombre) =>
    `carta-${nombre
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}`;

/*
 * Un grupo con todos sus platos en tamaños se muestra como la carta impresa:
 * los tamaños como columnas con su título arriba. Si mezcla platos de precio único,
 * cada plato muestra sus tamaños con el nombre al lado.
 */
function armarGrupo(nombre, items) {
    const todosConVariantes = items.every((item) => item.variantes?.length > 0);
    const columnas = todosConVariantes
        ? [...new Set(items.flatMap((item) => item.variantes.map((variante) => variante.nombre)))]
        : [];

    return { nombre, items, columnas };
}

function armarCategoria(nombre, productos) {
    const porSubcategoria = new Map();
    productos.forEach((producto) => {
        const sub = producto.subcategoria ?? '';
        if (!porSubcategoria.has(sub)) porSubcategoria.set(sub, []);
        porSubcategoria.get(sub).push(producto);
    });

    return {
        id: idCategoria(nombre),
        nombre,
        notas: NOTAS_CARTA[nombre] ?? [],
        grupos: [...porSubcategoria].map(([sub, items]) => armarGrupo(sub, items))
    };
}

export function agruparCarta(productos) {
    const porCategoria = new Map();
    productos.forEach((producto) => {
        if (!porCategoria.has(producto.categoria)) porCategoria.set(producto.categoria, []);
        porCategoria.get(producto.categoria).push(producto);
    });

    const categorias = new Map([...porCategoria].map(([nombre, lista]) => [nombre, armarCategoria(nombre, lista)]));
    const usadas = new Set();

    const secciones = SECCIONES_CARTA.map((seccion) => ({
        ancho: seccion.ancho,
        columnas: seccion.columnas.map((columna) =>
            columna
                .filter((nombre) => categorias.has(nombre))
                .map((nombre) => {
                    usadas.add(nombre);
                    return categorias.get(nombre);
                })
        )
    })).filter((seccion) => seccion.columnas.some((columna) => columna.length > 0));

    const restantes = [...categorias.values()].filter((categoria) => !usadas.has(categoria.nombre));
    for (let i = 0; i < restantes.length; i += 2) {
        secciones.push({ ancho: 'parejo', columnas: [[restantes[i]], restantes[i + 1] ? [restantes[i + 1]] : []] });
    }

    return secciones;
}

/* "Carne (Fritas)", "Muzzarella (Grande)": el nombre con lo que lo distingue dentro de la carta */
export const nombreEnPedido = (producto, variante) => {
    const detalle = [producto.subcategoria, variante?.nombre].filter(Boolean).join(', ');
    return detalle ? `${producto.nombre} (${detalle})` : producto.nombre;
};
