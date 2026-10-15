import Producto from '../models/Producto.js';

const productos = [
    new Producto(1, 'Muzzarella al molde', 'muzzarella.jpg', 14500, 'Masa alta, salsa de tomate, muzzarella y aceitunas verdes.'),
    new Producto(2, 'Fugazzeta rellena', 'fugazzeta.jpg', 17800, 'Doble masa rellena de muzzarella, cubierta de cebolla y orégano.'),
    new Producto(3, 'Napolitana', 'napolitana.jpg', 16200, 'Muzzarella, rodajas de tomate, ajo y perejil.'),
    new Producto(4, 'Fainá', 'faina.jpg', 2900, 'La porción de harina de garbanzos para poner arriba de la muzza.'),
    new Producto(5, 'Empanada frita de carne', 'empanada-carne.jpg', 2600, 'Carne cortada a cuchillo, cebolla, huevo y aceitunas.'),
    new Producto(6, 'Calabresa', 'calabresa.jpg', 16900, 'Muzzarella, longaniza calabresa y morrón asado.'),
    new Producto(7, 'Moscato', 'moscato.jpg', 6500, 'La botella que está en todas las mesas, para acompañar la pizza.')
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
