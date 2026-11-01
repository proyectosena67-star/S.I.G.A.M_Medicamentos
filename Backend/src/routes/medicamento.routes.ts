import { Router } from "express";
import { ROLES } from "../config/constantes";
import { medicamentoController } from "../controllers/medicamento.controller";
import { auditarAccion } from "../middlewares/auditoria.middleware";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";
import { validarActualizarMedicamento, validarCrearMedicamento, validarEstadoMedicamento } from "../middlewares/medicamento.middleware";
import { validarId } from "../middlewares/validar.middleware";

const router = Router();

router.use(autenticar);

router.get("/", medicamentoController.listar);
router.get("/:id", validarId, medicamentoController.obtener);

const puedeEscribir = autorizarRoles(ROLES.ADMINISTRADOR, ROLES.FARMACEUTICO);
router.post("/", puedeEscribir, validarCrearMedicamento, auditarAccion("CREAR", "medicamentos"), medicamentoController.crear);
router.patch("/:id", puedeEscribir, validarId, validarActualizarMedicamento, auditarAccion("ACTUALIZAR", "medicamentos"), medicamentoController.actualizar);
router.patch("/:id/estado", puedeEscribir, validarId, validarEstadoMedicamento, auditarAccion("CAMBIAR_ESTADO", "medicamentos"), medicamentoController.cambiarEstado);

export default router;
