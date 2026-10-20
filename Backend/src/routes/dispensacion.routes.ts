import { Router } from 'express';
import { dispensacionController as c } from '../controllers/dispensacion.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES as R } from '../utils/roles';

const router = Router();
router.use(autenticar);

router.get('/pendientes', permitir(R.FARMACEUTICO), c.pendientes);
router.get('/', permitir(R.ADMIN, R.FARMACEUTICO), c.listar);
router.post('/', permitir(R.FARMACEUTICO), c.dispensar);

export default router;
