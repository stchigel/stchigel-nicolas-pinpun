import { Router } from 'express';
import pedidoController from '../controllers/pedidoController.js';
import validateId from '../middlewares/validateId.js';
import validatePedido from '../middlewares/validatePedido.js';
import validateEstado from '../middlewares/validateEstado.js';
import validateAsignacion from '../middlewares/validateAsignacion.js';
import { autenticar, exigirAdministracion } from '../middlewares/auth.js';

const router = Router();

/*
 * Hacer un pedido es público. Verlos y cambiarles el estado es del panel de administración y, en lo que les toca,
 * de los repartidores (solo ven los suyos). Asignar el repartidor es de la administración.
 */
router.post('/', validatePedido, pedidoController.create);
router.get('/', autenticar, pedidoController.getAll);
router.get('/:id', autenticar, validateId, pedidoController.getById);
router.patch('/:id/estado', autenticar, validateId, validateEstado, pedidoController.cambiarEstado);

router.patch('/:id/repartidor', autenticar, exigirAdministracion, validateId, validateAsignacion, pedidoController.asignarRepartidor);

export default router;
