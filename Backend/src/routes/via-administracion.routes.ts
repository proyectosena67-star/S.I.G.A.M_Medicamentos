import { Router } from "express";
import { ROLES } from "../config/constantes";
import { viaAdministracionController } from "../controllers/via-administracion.controller";
import { auditarAccion } from "../middlewares/auditoria.middleware";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";
import { validarId } from "../middlewares/validar.middleware";
import { validarActualizarVia, validarCrearVia, validarEstadoVia } from "../middlewares/via-administracion.middleware";

const router = Router();

router.use(autenticar);

router.get("/", viaAdministracionController.listar);
router.get("/:id", validarId, viaAdministracionController.obtener);

const soloAdmin = autorizarRoles(ROLES.ADMINISTRADOR);
router.post("/", soloAdmin, validarCrearVia, auditarAccion("CREAR", "via_administracion"), viaAdministracionController.crear);
router.patch("/:id", soloAdmin, validarId, validarActualizarVia, auditarAccion("ACTUALIZAR", "via_administracion"), viaAdministracionController.actualizar);
router.patch("/:id/estado", soloAdmin, validarId, validarEstadoVia, auditarAccion("CAMBIAR_ESTADO", "via_administracion"), viaAdministracionController.cambiarEstado);

export default router;
