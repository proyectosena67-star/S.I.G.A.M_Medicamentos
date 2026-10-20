import { Router } from 'express';
import { aplicacionController as c } from '../controllers/aplicacion.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES as R } from '../utils/roles';

const router = Router();
router.use(autenticar);

router.get('/pendientes', permitir(R.ENFERMERIA), c.pendientes);
router.get('/', permitir(R.ADMIN, R.MEDICO, R.ENFERMERIA), c.listar);
router.post('/', permitir(R.ENFERMERIA), c.registrar);

export default router;
