import { envolver } from "../middlewares/envolver-async";
import { ordenMedicaService } from "../services/orden-medica.service";
import { leerId, responder } from "../utils/respuestas";

export const ordenMedicaController = {
  listar: envolver(async (_req, res) => {
    responder(res, await ordenMedicaService.listar(res.locals.query ?? {}));
  }),

  obtener: envolver(async (req, res) => {
    responder(res, await ordenMedicaService.obtener(leerId(req)));
  }),

  crear: envolver(async (req, res) => {
    const orden = await ordenMedicaService.crear(req.usuario!.id_usuario, req.body);
    res.locals.registroId = orden.id_orden;
    responder(res, orden, 201, "Orden médica creada y aplicaciones programadas");
  }),

  cambiarEstado: envolver(async (req, res) => {
    const orden = await ordenMedicaService.cambiarEstado(leerId(req), req.body.estado);
    res.locals.registroId = orden.id_orden;
    responder(res, orden, 200, `Orden ${orden.estado.toLowerCase()}`);
  }),
};
