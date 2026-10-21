import { Router } from 'express';
import seguimientoController from '../controllers/seguimientoController.js';

const router = Router();

/* Público: el código largo e inadivinable del enlace es lo que protege cada pedido */
router.get('/:codigo', seguimientoController.getPorCodigo);

export default router;
