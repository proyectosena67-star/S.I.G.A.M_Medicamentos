import { Router } from 'express';
import { usuarioController as c } from '../controllers/usuario.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { validarId } from '../middlewares/params.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES } from '../utils/roles';

const router = Router();
router.param('id', validarId);
router.use(autenticar, permitir(ROLES.ADMIN));

router.get('/', c.listar);
router.post('/', c.crear);
router.get('/:id', c.obtener);
router.put('/:id', c.actualizar);
router.patch('/:id/estado', c.cambiarEstado);
router.post('/:id/restablecer-password', c.restablecerPassword);

export default router;
