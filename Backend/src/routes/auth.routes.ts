import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { validarCambioPassword, validarLogin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", validarLogin, authController.iniciarSesion);
router.get("/me", autenticar, authController.perfil);
router.post("/cambiar-password", autenticar, validarCambioPassword, authController.cambiarPassword);

export default router;
