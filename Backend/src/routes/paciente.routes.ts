import { Router } from 'express';
import { pacienteController as c } from '../controllers/paciente.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { validarId } from '../middlewares/params.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES as R } from '../utils/roles';

const router = Router();
router.param('id', validarId);
router.use(autenticar);

const lectura = permitir(R.ADMIN, R.MEDICO, R.ENFERMERIA, R.PSICOLOGIA);
router.get('/', lectura, c.listar);
router.get('/:id', lectura, c.obtener);
router.get('/:id/historial', permitir(R.ADMIN, R.MEDICO), c.historial);

router.post('/', permitir(R.ADMIN), c.crear);
router.put('/:id', permitir(R.ADMIN), c.actualizar);
router.patch('/:id/estado', permitir(R.ADMIN), c.cambiarEstado);

export default router;
