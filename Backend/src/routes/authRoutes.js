import { Router } from 'express';
import authController from '../controllers/authController.js';
import validateLogin from '../middlewares/validateLogin.js';
import { autenticar } from '../middlewares/auth.js';

const router = Router();

router.post('/login', validateLogin, authController.login);
router.get('/me', autenticar, authController.me);

export default router;
