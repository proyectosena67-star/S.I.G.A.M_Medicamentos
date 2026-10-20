import { Router } from 'express';
import { detalleOrdenController as c } from '../controllers/detalleOrden.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { validarId } from '../middlewares/params.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES as R } from '../utils/roles';

const router = Router();
router.param('id', validarId);
router.use(autenticar, permitir(R.ADMIN, R.MEDICO, R.FARMACEUTICO, R.ENFERMERIA));

router.get('/', c.listar);
router.get('/:id', c.obtener);

export default router;
