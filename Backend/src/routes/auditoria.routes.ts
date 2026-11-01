import { Router } from "express";
import { ROLES } from "../config/constantes";
import { auditoriaController } from "../controllers/auditoria.controller";
import { validarFiltrosAuditoria } from "../middlewares/auditoria-consulta.middleware";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";

const router = Router();

router.get("/", autenticar, autorizarRoles(ROLES.ADMINISTRADOR), validarFiltrosAuditoria, auditoriaController.listar);

export default router;
