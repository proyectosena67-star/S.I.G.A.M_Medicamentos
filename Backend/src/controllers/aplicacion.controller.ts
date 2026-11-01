import { envolver } from "../middlewares/envolver-async";
import { aplicacionService } from "../services/aplicacion.service";
import { leerId, responder } from "../utils/respuestas";

export const aplicacionController = {
  listar: envolver(async (req, res) => {
    responder(res, await aplicacionService.listar(res.locals.query ?? {}, req.usuario!));
  }),

  obtener: envolver(async (req, res) => {
    responder(res, await aplicacionService.obtener(leerId(req)));
  }),

  asignarEnfermero: envolver(async (req, res) => {
    const aplicacion = await aplicacionService.asignarEnfermero(leerId(req), req.body);
    res.locals.registroId = aplicacion.id_aplicacion;
    responder(res, aplicacion, 200, "Enfermero asignado");
  }),

  registrar: envolver(async (req, res) => {
    const aplicacion = await aplicacionService.registrar(leerId(req), req.body, req.usuario!);
    res.locals.registroId = aplicacion.id_aplicacion;
    responder(res, aplicacion, 200, "Aplicación registrada");
  }),
};
