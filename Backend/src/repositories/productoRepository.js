import Producto from '../models/Producto.js';

const productos = [
    new Producto(1, 'Pizza Muzzarella', 'pizza-muzzarella.jpg', 8500, 'Salsa de tomate, muzzarella y aceitunas.'),
    new Producto(2, 'Hamburguesa Clásica', 'hamburguesa-clasica.jpg', 7200, 'Carne, lechuga, tomate y queso cheddar.'),
    new Producto(3, 'Limonada', 'limonada.jpg', 2500, 'Limonada natural con menta y jengibre.')
];

let nextId = productos.length + 1;

const findAll = () => [...productos];

const findById = (id) => productos.find((producto) => producto.id === id) ?? null;

const findByNombre = (nombre) =>
    productos.find((producto) => producto.nombre.toLowerCase() === nombre.toLowerCase()) ?? null;

const create = ({ nombre, imagen, precio, descripcion }) => {
    const producto = new Producto(nextId++, nombre, imagen, precio, descripcion);
    productos.push(producto);
    return producto;
};

const update = (id, { nombre, imagen, precio, descripcion }) => {
    const index = productos.findIndex((producto) => producto.id === id);
    if (index === -1) return null;

    const producto = new Producto(id, nombre, imagen, precio, descripcion);
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
