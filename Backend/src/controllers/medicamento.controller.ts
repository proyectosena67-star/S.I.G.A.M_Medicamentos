import { envolver } from "../middlewares/envolver-async";
import { medicamentoService } from "../services/medicamento.service";
import { leerId, responder } from "../utils/respuestas";

export const medicamentoController = {
  listar: envolver(async (_req, res) => {
    responder(res, await medicamentoService.listar());
  }),

  obtener: envolver(async (req, res) => {
    responder(res, await medicamentoService.obtener(leerId(req)));
  }),

  crear: envolver(async (req, res) => {
    const medicamento = await medicamentoService.crear(req.body);
    res.locals.registroId = medicamento.id_medicamento;
    responder(res, medicamento, 201, "Medicamento creado");
  }),

  actualizar: envolver(async (req, res) => {
    const medicamento = await medicamentoService.actualizar(leerId(req), req.body);
    res.locals.registroId = medicamento.id_medicamento;
    responder(res, medicamento);
  }),

  cambiarEstado: envolver(async (req, res) => {
    const medicamento = await medicamentoService.cambiarEstado(leerId(req), req.body.estado);
    res.locals.registroId = medicamento.id_medicamento;
    responder(res, medicamento, 200, medicamento.estado ? "Medicamento activado" : "Medicamento desactivado");
  }),
};
