import { Router } from 'express';
import productoRoutes from './productoRoutes.js';
import localRoutes from './localRoutes.js';
import authRoutes from './authRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import reservaRoutes from './reservaRoutes.js';

const router = Router();

router.use('/productos', productoRoutes);
router.use('/locales', localRoutes);
router.use('/auth', authRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/reservas', reservaRoutes);

export default router;
