import { Router } from 'express';
import { authController as c } from '../controllers/auth.controller';
import { autenticar } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', c.login);
router.post('/logout', autenticar, c.logout);
router.get('/perfil', autenticar, c.perfil);
router.put('/perfil', autenticar, c.actualizarPerfil);
router.put('/password', autenticar, c.cambiarPassword);

export default router;
