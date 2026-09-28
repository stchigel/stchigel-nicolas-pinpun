import { Router } from 'express';
import productoRoutes from './productoRoutes.js';

const router = Router();

router.use('/productos', productoRoutes);

export default router;
