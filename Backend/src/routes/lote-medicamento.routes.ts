import { Router } from "express";
import { ROLES } from "../config/constantes";
import { loteMedicamentoController } from "../controllers/lote-medicamento.controller";
import { auditarAccion } from "../middlewares/auditoria.middleware";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";
import { validarActualizarLote, validarCrearLote } from "../middlewares/lote-medicamento.middleware";
import { validarId } from "../middlewares/validar.middleware";

const router = Router();

router.use(autenticar);

router.get("/", loteMedicamentoController.listar);
router.get("/:id", validarId, loteMedicamentoController.obtener);

const puedeEscribir = autorizarRoles(ROLES.ADMINISTRADOR, ROLES.FARMACEUTICO);
router.post("/", puedeEscribir, validarCrearLote, auditarAccion("CREAR", "lotes_medicamento"), loteMedicamentoController.crear);
router.patch("/:id", puedeEscribir, validarId, validarActualizarLote, auditarAccion("ACTUALIZAR", "lotes_medicamento"), loteMedicamentoController.actualizar);

export default router;
