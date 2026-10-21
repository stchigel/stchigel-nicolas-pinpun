import { Router } from 'express';
import repartidorController from '../controllers/repartidorController.js';
import validateId from '../middlewares/validateId.js';
import { validateAltaRepartidor, validateEdicionRepartidor } from '../middlewares/validateRepartidor.js';
import { autenticar, exigirAdministracion } from '../middlewares/auth.js';

const router = Router();

/* Las cuentas de reparto las manejan las sucursales (las suyas) y la administración general (todas) */
router.use(autenticar, exigirAdministracion);

router.get('/', repartidorController.getAll);
router.post('/', validateAltaRepartidor, repartidorController.create);
router.put('/:id', validateId, validateEdicionRepartidor, repartidorController.update);

export default router;
