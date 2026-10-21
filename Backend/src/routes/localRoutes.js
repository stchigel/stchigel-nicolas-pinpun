import { Router } from 'express';
import localController from '../controllers/localController.js';
import validateId from '../middlewares/validateId.js';
import validateLocal from '../middlewares/validateLocal.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();

router.get('/', localController.getAll);
router.get('/:id', validateId, localController.getById);
router.put('/:id', autenticar, validateId, validateLocal, localController.update);

export default router;
