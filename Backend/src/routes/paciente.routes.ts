import { Router } from "express";
import { ROLES } from "../config/constantes";
import { pacienteController } from "../controllers/paciente.controller";
import { auditarAccion } from "../middlewares/auditoria.middleware";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";
import { validarActualizarPaciente, validarCrearPaciente, validarEstadoPaciente } from "../middlewares/paciente.middleware";
import { validarId } from "../middlewares/validar.middleware";

const router = Router();

router.use(autenticar);

router.get("/", pacienteController.listar);
router.get("/:id", validarId, pacienteController.obtener);

const puedeEscribir = autorizarRoles(ROLES.ADMINISTRADOR, ROLES.MEDICO);
router.post("/", puedeEscribir, validarCrearPaciente, auditarAccion("CREAR", "pacientes"), pacienteController.crear);
router.patch("/:id", puedeEscribir, validarId, validarActualizarPaciente, auditarAccion("ACTUALIZAR", "pacientes"), pacienteController.actualizar);
router.patch("/:id/estado", autorizarRoles(ROLES.ADMINISTRADOR), validarId, validarEstadoPaciente, auditarAccion("CAMBIAR_ESTADO", "pacientes"), pacienteController.cambiarEstado);

export default router;
