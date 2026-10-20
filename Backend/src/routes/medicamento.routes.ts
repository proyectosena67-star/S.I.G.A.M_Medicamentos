import { Router } from 'express';
import { medicamentoController as c } from '../controllers/medicamento.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { validarId } from '../middlewares/params.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES as R } from '../utils/roles';

const router = Router();
router.param('id', validarId);
router.use(autenticar);

router.get('/', c.listar);
router.get('/:id', c.obtener);

const gestion = permitir(R.ADMIN, R.FARMACEUTICO);
router.post('/', gestion, c.crear);
router.put('/:id', gestion, c.actualizar);
router.patch('/:id/estado', gestion, c.cambiarEstado);

export default router;
