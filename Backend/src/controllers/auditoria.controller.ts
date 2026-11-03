import { envolver } from "../middlewares/envolver-async";
import { auditoriaService } from "../services/auditoria.service";
import { responder } from "../utils/respuestas";

export const auditoriaController = {
  listar: envolver(async (_req, res) => {
    responder(res, await auditoriaService.listar(res.locals.query));
  }),
};
