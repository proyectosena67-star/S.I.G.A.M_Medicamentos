import { envolver } from "../middlewares/envolver-async";
import { detalleOrdenRepository } from "../repositories/detalle-orden.repository";
import { leerId, responder } from "../utils/respuestas";

export const detalleOrdenController = {
  /** Medicamentos (con su dosificación) de una orden: GET /ordenes/:id/medicamentos */
  listarPorOrden: envolver(async (req, res) => {
    responder(res, await detalleOrdenRepository.listarPorOrden(leerId(req)));
  }),
};
