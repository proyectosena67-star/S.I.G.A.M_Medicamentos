import { Router } from 'express';
import { ordenController as c } from '../controllers/orden.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { validarId } from '../middlewares/params.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES as R } from '../utils/roles';

const router = Router();
router.param('id', validarId);
router.use(autenticar);

const lectura = permitir(R.ADMIN, R.MEDICO, R.FARMACEUTICO, R.ENFERMERIA);
router.get('/', lectura, c.listar);
router.get('/:id', lectura, c.obtener);

// Solo el médico crea, modifica o cancela órdenes (enfermería y farmacia quedan bloqueados)
router.post('/', permitir(R.MEDICO), c.crear);
router.put('/:id', permitir(R.MEDICO), c.editar);
router.patch('/:id/estado', permitir(R.MEDICO), c.cambiarEstado);

export default router;
