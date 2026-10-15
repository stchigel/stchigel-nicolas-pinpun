import { Router } from 'express';
import productoRoutes from './productoRoutes.js';
import localRoutes from './localRoutes.js';

const router = Router();

router.use('/productos', productoRoutes);
router.use('/locales', localRoutes);

export default router;
