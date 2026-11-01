import { envolver } from "../middlewares/envolver-async";
import { rolService } from "../services/rol.service";
import { leerId, responder } from "../utils/respuestas";

export const rolController = {
  listar: envolver(async (_req, res) => {
    responder(res, await rolService.listar());
  }),

  obtener: envolver(async (req, res) => {
    responder(res, await rolService.obtener(leerId(req)));
  }),
};
