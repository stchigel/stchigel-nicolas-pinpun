import Producto from '../models/Producto.js';
import carta from '../data/carta.js';

const productos = carta.map((datos, index) => new Producto({ id: index + 1, ...datos }));

let nextId = productos.length + 1;

const mismoTexto = (a = '', b = '') => a.toLowerCase() === b.toLowerCase();

/* Filtra por categoría y/o por destacado; sin filtros devuelve toda la carta en su orden. */
const findAll = ({ categoria, destacado } = {}) =>
    productos.filter(
        (producto) =>
            (categoria === undefined || mismoTexto(producto.categoria, categoria)) &&
            (destacado === undefined || producto.destacado === destacado)
    );

const findById = (id) => productos.find((producto) => producto.id === id) ?? null;

/* El nombre se repite entre secciones ("Carne" al horno y frita), así que se busca dentro de la misma */
const findByNombre = ({ nombre, categoria, subcategoria }) =>
    productos.find(
        (producto) =>
            mismoTexto(producto.nombre, nombre) &&
            mismoTexto(producto.categoria, categoria) &&
            mismoTexto(producto.subcategoria, subcategoria)
    ) ?? null;

const create = (datos) => {
    const producto = new Producto({ id: nextId++, ...datos });
    productos.push(producto);
    return producto;
};

const update = (id, datos) => {
    const index = productos.findIndex((producto) => producto.id === id);
    if (index === -1) return null;

    const producto = new Producto({ id, ...datos });
    productos[index] = producto;
    return producto;
};

const remove = (id) => {
    const index = productos.findIndex((producto) => producto.id === id);
    if (index === -1) return null;

    const [producto] = productos.splice(index, 1);
    return producto;
};

export default { findAll, findById, findByNombre, create, update, remove };
