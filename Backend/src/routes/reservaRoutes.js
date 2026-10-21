import { Router } from 'express';
import reservaController from '../controllers/reservaController.js';
import validateId from '../middlewares/validateId.js';
import validateReserva from '../middlewares/validateReserva.js';
import validateEstado from '../middlewares/validateEstado.js';
import { autenticar, exigirAdministracion } from '../middlewares/auth.js';

const router = Router();

/* Pedir una mesa es público; verlas y aceptarlas o rechazarlas es del panel de administración */
router.post('/', validateReserva, reservaController.create);
router.get('/', autenticar, exigirAdministracion, reservaController.getAll);
router.get('/:id', autenticar, exigirAdministracion, validateId, reservaController.getById);
router.patch('/:id/estado', autenticar, exigirAdministracion, validateId, validateEstado, reservaController.cambiarEstado);

export default router;
