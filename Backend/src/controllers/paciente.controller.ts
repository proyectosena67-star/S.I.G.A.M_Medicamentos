import { envolver } from "../middlewares/envolver-async";
import { pacienteService } from "../services/paciente.service";
import { leerId, responder } from "../utils/respuestas";

export const pacienteController = {
  listar: envolver(async (_req, res) => {
    responder(res, await pacienteService.listar());
  }),

  obtener: envolver(async (req, res) => {
    responder(res, await pacienteService.obtener(leerId(req)));
  }),

  crear: envolver(async (req, res) => {
    const paciente = await pacienteService.crear(req.body);
    res.locals.registroId = paciente.id_paciente;
    responder(res, paciente, 201, "Paciente creado");
  }),

  actualizar: envolver(async (req, res) => {
    const paciente = await pacienteService.actualizar(leerId(req), req.body);
    res.locals.registroId = paciente.id_paciente;
    responder(res, paciente);
  }),

  cambiarEstado: envolver(async (req, res) => {
    const paciente = await pacienteService.cambiarEstado(leerId(req), req.body.estado);
    res.locals.registroId = paciente.id_paciente;
    responder(res, paciente, 200, paciente.estado ? "Paciente activado" : "Paciente desactivado");
  }),
};
