import { envolver } from "../middlewares/envolver-async";
import { viaAdministracionService } from "../services/via-administracion.service";
import { leerId, responder } from "../utils/respuestas";

export const viaAdministracionController = {
  listar: envolver(async (_req, res) => {
    responder(res, await viaAdministracionService.listar());
  }),

  obtener: envolver(async (req, res) => {
    responder(res, await viaAdministracionService.obtener(leerId(req)));
  }),

  crear: envolver(async (req, res) => {
    const via = await viaAdministracionService.crear(req.body);
    res.locals.registroId = via.id_via;
    responder(res, via, 201, "Vía de administración creada");
  }),

  actualizar: envolver(async (req, res) => {
    const via = await viaAdministracionService.actualizar(leerId(req), req.body);
    res.locals.registroId = via.id_via;
    responder(res, via);
  }),

  cambiarEstado: envolver(async (req, res) => {
    const via = await viaAdministracionService.cambiarEstado(leerId(req), req.body.estado);
    res.locals.registroId = via.id_via;
    responder(res, via, 200, via.estado ? "Vía activada" : "Vía desactivada");
  }),
};
