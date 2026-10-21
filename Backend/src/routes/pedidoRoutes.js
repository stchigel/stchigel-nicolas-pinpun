import { Router } from 'express';
import pedidoController from '../controllers/pedidoController.js';
import validateId from '../middlewares/validateId.js';
import validatePedido from '../middlewares/validatePedido.js';
import validateEstado from '../middlewares/validateEstado.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();

/* Hacer un pedido es público; verlos y cambiarles el estado es del panel de administración */
router.post('/', validatePedido, pedidoController.create);
router.get('/', autenticar, pedidoController.getAll);
router.get('/:id', autenticar, validateId, pedidoController.getById);
router.patch('/:id/estado', autenticar, validateId, validateEstado, pedidoController.cambiarEstado);

export default router;
