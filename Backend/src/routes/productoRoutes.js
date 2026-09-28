import { Router } from 'express';
import productoController from '../controllers/productoController.js';
import validateId from '../middlewares/validateId.js';
import validateProducto from '../middlewares/validateProducto.js';

const router = Router();

router.get('/', productoController.getAll);
router.get('/:id', validateId, productoController.getById);
router.post('/', validateProducto, productoController.create);
router.put('/:id', validateId, validateProducto, productoController.update);
router.delete('/:id', validateId, productoController.remove);

export default router;
