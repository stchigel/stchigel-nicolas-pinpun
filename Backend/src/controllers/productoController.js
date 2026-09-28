import productoService from '../services/productoService.js';

const getAll = (req, res) => {
    res.status(200).json(productoService.getAll());
};

const getById = (req, res) => {
    const producto = productoService.getById(Number(req.params.id));
    if (!producto) return res.status(404).json({ message: 'El producto no existe.' });

    res.status(200).json(producto);
};

const create = (req, res) => {
    res.status(201).json(productoService.create(req.body));
};

const update = (req, res) => {
    const producto = productoService.update(Number(req.params.id), req.body);
    if (!producto) return res.status(404).json({ message: 'El producto no existe.' });

    res.status(200).json(producto);
};

const remove = (req, res) => {
    const producto = productoService.remove(Number(req.params.id));
    if (!producto) return res.status(404).json({ message: 'El producto no existe.' });

    res.status(200).json(producto);
};

export default { getAll, getById, create, update, remove };
