import { Router } from 'express';
import localController from '../controllers/localController.js';
import validateId from '../middlewares/validateId.js';
import validateLocal from '../middlewares/validateLocal.js';
import cartaController from '../controllers/cartaController.js';
import { validateAsignacionCartas } from '../middlewares/validateCarta.js';
import { autenticar, exigirAdministracion, exigirGeneral } from '../middlewares/auth.js';

const router = Router();

router.get('/', localController.getAll);
router.get('/:id', validateId, localController.getById);
router.put('/:id', autenticar, exigirAdministracion, validateId, validateLocal, localController.update);

/* Qué carta (menú) usa el local en el salón y al pedir (delivery y retiro): lo decide la administración general */
router.put('/:id/cartas', autenticar, exigirGeneral, validateId, validateAsignacionCartas, cartaController.asignarALocal);

export default router;
