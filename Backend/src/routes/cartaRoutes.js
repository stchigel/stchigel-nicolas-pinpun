import { Router } from 'express';
import cartaController from '../controllers/cartaController.js';
import validateId from '../middlewares/validateId.js';
import { validateAltaCarta, validateNombreCarta } from '../middlewares/validateCarta.js';
import { autenticar, exigirGeneral } from '../middlewares/auth.js';

const router = Router();

/* Las cartas (menús) las maneja la administración general; qué carta usa cada local está en PUT /api/locales/:id/cartas */
router.use(autenticar, exigirGeneral);

router.get('/', cartaController.getAll);
router.post('/', validateAltaCarta, cartaController.create);
router.put('/:id', validateId, validateNombreCarta, cartaController.renombrar);
router.delete('/:id', validateId, cartaController.remove);

export default router;
