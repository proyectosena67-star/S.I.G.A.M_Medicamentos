import { crearAplicacionDto, filtrosAplicacionDto } from '../dtos/aplicacion.dto';
import { validar } from '../dtos/validar';
import { aplicacionService } from '../services/aplicacion.service';
import { asyncHandler, usuarioActual } from '../utils/http';

export const aplicacionController = {
  pendientes: asyncHandler(async (_req, res) => {
    res.json(await aplicacionService.pendientes());
  }),
  listar: asyncHandler(async (req, res) => {
    res.json(await aplicacionService.listar(validar(filtrosAplicacionDto, req.query)));
  }),
  registrar: asyncHandler(async (req, res) => {
    res.status(201).json(
      await aplicacionService.registrar(usuarioActual(req), validar(crearAplicacionDto, req.body), req.ip)
    );
  }),
};
