import { Router } from 'express';
import { auditoriaController as c } from '../controllers/auditoria.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES } from '../utils/roles';

const router = Router();

// Solo lectura: no existen rutas para editar ni borrar registros de auditoría
router.get('/', autenticar, permitir(ROLES.ADMIN), c.listar);

export default router;
