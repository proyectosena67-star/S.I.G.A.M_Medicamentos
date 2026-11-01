import { Router } from "express";
import { ROLES } from "../config/constantes";
import { usuarioController } from "../controllers/usuario.controller";
import { auditarAccion } from "../middlewares/auditoria.middleware";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";
import { validarActualizarUsuario, validarCrearUsuario, validarEstadoUsuario } from "../middlewares/usuario.middleware";
import { validarId } from "../middlewares/validar.middleware";

const router = Router();

router.use(autenticar);

// El Enfermero Jefe necesita ver a los enfermeros para asignarles aplicaciones.
router.get("/enfermeros", autorizarRoles(ROLES.ADMINISTRADOR, ROLES.ENFERMERO_JEFE), usuarioController.listarEnfermeros);

// Todo lo demás es solo del Administrador.
router.use(autorizarRoles(ROLES.ADMINISTRADOR));

router.get("/", usuarioController.listar);
router.get("/:id", validarId, usuarioController.obtener);
router.post("/", validarCrearUsuario, auditarAccion("CREAR", "usuarios"), usuarioController.crear);
router.patch("/:id", validarId, validarActualizarUsuario, auditarAccion("ACTUALIZAR", "usuarios"), usuarioController.actualizar);
router.patch("/:id/estado", validarId, validarEstadoUsuario, auditarAccion("CAMBIAR_ESTADO", "usuarios"), usuarioController.cambiarEstado);

export default router;
