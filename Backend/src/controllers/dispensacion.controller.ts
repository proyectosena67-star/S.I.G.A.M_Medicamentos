import { envolver } from "../middlewares/envolver-async";
import { dispensacionService } from "../services/dispensacion.service";
import { leerId, responder } from "../utils/respuestas";

export const dispensacionController = {
  listar: envolver(async (_req, res) => {
    responder(res, await dispensacionService.listar(res.locals.query ?? {}));
  }),

  obtener: envolver(async (req, res) => {
    responder(res, await dispensacionService.obtener(leerId(req)));
  }),

  crear: envolver(async (req, res) => {
    const dispensacion = await dispensacionService.crear(req.usuario!.id_usuario, req.body);
    res.locals.registroId = dispensacion.id_dispensacion;
    responder(res, dispensacion, 201, "Dispensación registrada");
  }),
};
