import { Router } from 'express';
import { loteController as c } from '../controllers/lote.controller';
import { autenticar } from '../middlewares/auth.middleware';
import { validarId } from '../middlewares/params.middleware';
import { permitir } from '../middlewares/rol.middleware';
import { ROLES as R } from '../utils/roles';

const router = Router();
router.param('id', validarId);
router.use(autenticar);

router.get('/', permitir(R.ADMIN, R.FARMACEUTICO), c.listar);
router.get('/alertas', permitir(R.ADMIN, R.FARMACEUTICO), c.alertas);
router.post('/', permitir(R.FARMACEUTICO), c.crear);
router.put('/:id', permitir(R.FARMACEUTICO), c.actualizar);

export default router;
