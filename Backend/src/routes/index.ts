import { Router } from 'express';
import aplicacionRoutes from './aplicacion.routes';
import auditoriaRoutes from './auditoria.routes';
import authRoutes from './auth.routes';
import detalleOrdenRoutes from './detalleOrden.routes';
import dispensacionRoutes from './dispensacion.routes';
import loteRoutes from './lote.routes';
import medicamentoRoutes from './medicamento.routes';
import ordenRoutes from './orden.routes';
import pacienteRoutes from './paciente.routes';
import rolRoutes from './rol.routes';
import usuarioRoutes from './usuario.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/roles', rolRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/pacientes', pacienteRoutes);
router.use('/medicamentos', medicamentoRoutes);
router.use('/lotes', loteRoutes);
router.use('/ordenes', ordenRoutes);
router.use('/detalle-orden', detalleOrdenRoutes);
router.use('/dispensaciones', dispensacionRoutes);
router.use('/aplicaciones', aplicacionRoutes);
router.use('/auditoria', auditoriaRoutes);

export default router;
