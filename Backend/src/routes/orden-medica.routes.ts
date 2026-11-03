import { Router } from "express";
import { ROLES } from "../config/constantes";
import { detalleOrdenController } from "../controllers/detalle-orden.controller";
import { ordenMedicaController } from "../controllers/orden-medica.controller";
import { auditarAccion } from "../middlewares/auditoria.middleware";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";
import { validarCrearOrden, validarEstadoOrden, validarFiltrosOrden } from "../middlewares/orden-medica.middleware";
import { validarId } from "../middlewares/validar.middleware";

const router = Router();

router.use(autenticar);

router.get("/", validarFiltrosOrden, ordenMedicaController.listar);
router.get("/:id", validarId, ordenMedicaController.obtener);
router.get("/:id/medicamentos", validarId, detalleOrdenController.listarPorOrden);

const soloMedico = autorizarRoles(ROLES.MEDICO);
router.post("/", soloMedico, validarCrearOrden, auditarAccion("CREAR", "orden_medica"), ordenMedicaController.crear);
router.patch(
  "/:id/estado",
  autorizarRoles(ROLES.MEDICO, ROLES.ADMINISTRADOR),
  validarId,
  validarEstadoOrden,
  auditarAccion("CAMBIAR_ESTADO", "orden_medica"),
  ordenMedicaController.cambiarEstado
);

export default router;
