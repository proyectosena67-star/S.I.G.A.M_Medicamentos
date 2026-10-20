import { Router } from 'express';
import { rolController as c } from '../controllers/rol.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { validarId } from '../middlewares/params.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES } from '../utils/roles';

const router = Router();
router.param('id', validarId);
router.use(autenticar, permitir(ROLES.ADMIN));

router.get('/', c.listar);
router.post('/', c.crear);
router.put('/:id', c.actualizar);
router.patch('/:id/estado', c.cambiarEstado);

export default router;
