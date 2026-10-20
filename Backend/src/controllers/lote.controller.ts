import { actualizarLoteDto, crearLoteDto, filtrosLoteDto } from '../dtos/lote.dto';
import { validar } from '../dtos/validar';
import { loteService } from '../services/lote.service';
import { asyncHandler, idDe, usuarioActual } from '../utils/http';

export const loteController = {
  listar: asyncHandler(async (req, res) => {
    res.json(await loteService.listar(validar(filtrosLoteDto, req.query)));
  }),
  alertas: asyncHandler(async (_req, res) => {
    res.json(await loteService.alertas());
  }),
  crear: asyncHandler(async (req, res) => {
    res.status(201).json(await loteService.crear(usuarioActual(req), validar(crearLoteDto, req.body), req.ip));
  }),
  actualizar: asyncHandler(async (req, res) => {
    res.json(await loteService.actualizar(usuarioActual(req), idDe(req), validar(actualizarLoteDto, req.body), req.ip));
  }),
};
