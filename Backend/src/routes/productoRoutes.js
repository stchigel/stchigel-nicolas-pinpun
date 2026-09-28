import { Router } from 'express';
import productoController from '../controllers/productoController.js';

const router = Router();

router.get('/', productoController.getAll);
router.get('/:id', productoController.getById);
router.post('/', productoController.create);
router.put('/:id', productoController.update);
router.delete('/:id', productoController.remove);

export default router;
