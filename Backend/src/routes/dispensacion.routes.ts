import { Router } from "express";
import { ROLES } from "../config/constantes";
import { dispensacionController } from "../controllers/dispensacion.controller";
import { auditarAccion } from "../middlewares/auditoria.middleware";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";
import { validarCrearDispensacion, validarFiltrosDispensacion } from "../middlewares/dispensacion.middleware";
import { validarId } from "../middlewares/validar.middleware";

const router = Router();

router.use(autenticar);

router.get("/", autorizarRoles(ROLES.ADMINISTRADOR, ROLES.FARMACEUTICO, ROLES.ENFERMERO_JEFE), validarFiltrosDispensacion, dispensacionController.listar);
router.get("/:id", autorizarRoles(ROLES.ADMINISTRADOR, ROLES.FARMACEUTICO, ROLES.ENFERMERO_JEFE), validarId, dispensacionController.obtener);
router.post("/", autorizarRoles(ROLES.FARMACEUTICO), validarCrearDispensacion, auditarAccion("CREAR", "dispensaciones"), dispensacionController.crear);

export default router;
