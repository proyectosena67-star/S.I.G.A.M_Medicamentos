import { crearDispensacionDto, filtrosDispensacionDto } from '../dtos/dispensacion.dto';
import { validar } from '../dtos/validar';
import { dispensacionService } from '../services/dispensacion.service';
import { asyncHandler, usuarioActual } from '../utils/http';

export const dispensacionController = {
  pendientes: asyncHandler(async (_req, res) => {
    res.json(await dispensacionService.pendientes());
  }),
  listar: asyncHandler(async (req, res) => {
    res.json(await dispensacionService.listar(validar(filtrosDispensacionDto, req.query)));
  }),
  dispensar: asyncHandler(async (req, res) => {
    res.status(201).json(
      await dispensacionService.dispensar(usuarioActual(req), validar(crearDispensacionDto, req.body), req.ip)
    );
  }),
};
