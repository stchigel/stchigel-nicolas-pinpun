import { Router } from 'express';
import productoController from '../controllers/productoController.js';
import validateId from '../middlewares/validateId.js';
import validateProducto from '../middlewares/validateProducto.js';
import { autenticar, exigirGeneral } from '../middlewares/auth.js';

const router = Router();

/* La carta es la misma para todos los locales: la lee cualquiera, pero solo la edita el administrador general */
router.get('/', productoController.getAll);
router.get('/:id', validateId, productoController.getById);
router.post('/', autenticar, exigirGeneral, validateProducto, productoController.create);
router.put('/:id', autenticar, exigirGeneral, validateId, validateProducto, productoController.update);
router.delete('/:id', autenticar, exigirGeneral, validateId, productoController.remove);

export default router;
