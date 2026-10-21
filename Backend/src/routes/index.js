import { Router } from 'express';
import productoRoutes from './productoRoutes.js';
import localRoutes from './localRoutes.js';
import authRoutes from './authRoutes.js';
import pedidoRoutes from './pedidoRoutes.js';
import reservaRoutes from './reservaRoutes.js';
import repartidorRoutes from './repartidorRoutes.js';
import seguimientoRoutes from './seguimientoRoutes.js';

const router = Router();

router.use('/productos', productoRoutes);
router.use('/locales', localRoutes);
router.use('/auth', authRoutes);
router.use('/pedidos', pedidoRoutes);
router.use('/reservas', reservaRoutes);
router.use('/repartidores', repartidorRoutes);
router.use('/seguimiento', seguimientoRoutes);

export default router;
