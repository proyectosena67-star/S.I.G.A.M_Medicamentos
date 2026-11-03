import { envolver } from "../middlewares/envolver-async";
import { loteMedicamentoService } from "../services/lote-medicamento.service";
import { leerId, responder } from "../utils/respuestas";

export const loteMedicamentoController = {
  listar: envolver(async (_req, res) => {
    responder(res, await loteMedicamentoService.listar());
  }),

  obtener: envolver(async (req, res) => {
    responder(res, await loteMedicamentoService.obtener(leerId(req)));
  }),

  crear: envolver(async (req, res) => {
    const lote = await loteMedicamentoService.crear(req.body);
    res.locals.registroId = lote.id_lote;
    responder(res, lote, 201, "Lote registrado");
  }),

  actualizar: envolver(async (req, res) => {
    const lote = await loteMedicamentoService.actualizar(leerId(req), req.body);
    res.locals.registroId = lote.id_lote;
    responder(res, lote);
  }),
};
