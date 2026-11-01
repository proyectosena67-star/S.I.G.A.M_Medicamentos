import { Router } from "express";
import { ROLES } from "../config/constantes";
import { aplicacionImagenController } from "../controllers/aplicacion-imagen.controller";
import { aplicacionController } from "../controllers/aplicacion.controller";
import { validarCrearImagen } from "../middlewares/aplicacion-imagen.middleware";
import { validarAsignarEnfermero, validarFiltrosAplicacion, validarRegistrarAplicacion } from "../middlewares/aplicacion.middleware";
import { auditarAccion } from "../middlewares/auditoria.middleware";
import { autenticar } from "../middlewares/autenticacion.middleware";
import { autorizarRoles } from "../middlewares/autorizacion.middleware";
import { validarId } from "../middlewares/validar.middleware";

const router = Router();

router.use(autenticar);

const personalClinico = autorizarRoles(ROLES.ADMINISTRADOR, ROLES.MEDICO, ROLES.ENFERMERO_JEFE, ROLES.ENFERMERO);
const enfermeria = autorizarRoles(ROLES.ENFERMERO_JEFE, ROLES.ENFERMERO);

router.get("/", personalClinico, validarFiltrosAplicacion, aplicacionController.listar);
router.get("/:id", personalClinico, validarId, aplicacionController.obtener);

router.patch(
  "/:id/asignar",
  autorizarRoles(ROLES.ENFERMERO_JEFE, ROLES.ADMINISTRADOR),
  validarId,
  validarAsignarEnfermero,
  auditarAccion("ASIGNAR_ENFERMERO", "aplicacion"),
  aplicacionController.asignarEnfermero
);
router.patch(
  "/:id/registrar",
  enfermeria,
  validarId,
  validarRegistrarAplicacion,
  auditarAccion("REGISTRAR_APLICACION", "aplicacion"),
  aplicacionController.registrar
);
router.post(
  "/:id/imagenes",
  enfermeria,
  validarId,
  validarCrearImagen,
  auditarAccion("CREAR", "aplicacion_imagen"),
  aplicacionImagenController.agregar
);

export default router;
