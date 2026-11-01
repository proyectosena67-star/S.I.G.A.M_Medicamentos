import { Router } from "express";
import { ROLES } from "../config/constantes";
import { rolController } from "../controllers/rol.controller";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";
import { validarId } from "../middlewares/validar.middleware";

const router = Router();

router.use(autenticar, autorizarRoles(ROLES.ADMINISTRADOR));

router.get("/", rolController.listar);
router.get("/:id", validarId, rolController.obtener);

export default router;
