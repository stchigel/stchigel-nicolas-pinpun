import { Router } from 'express';
import localController from '../controllers/localController.js';
import validateId from '../middlewares/validateId.js';

const router = Router();

router.get('/', localController.getAll);
router.get('/:id', validateId, localController.getById);

export default router;
