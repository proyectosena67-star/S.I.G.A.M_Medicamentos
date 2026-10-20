import { estadoDto } from '../dtos/common.dto';
import { actualizarRolDto, crearRolDto } from '../dtos/rol.dto';
import { validar } from '../dtos/validar';
import { rolService } from '../services/rol.service';
import { asyncHandler, idDe, usuarioActual } from '../utils/http';

export const rolController = {
  listar: asyncHandler(async (_req, res) => {
    res.json(await rolService.listar());
  }),
  crear: asyncHandler(async (req, res) => {
    res.status(201).json(await rolService.crear(usuarioActual(req), validar(crearRolDto, req.body), req.ip));
  }),
  actualizar: asyncHandler(async (req, res) => {
    res.json(await rolService.actualizar(usuarioActual(req), idDe(req), validar(actualizarRolDto, req.body), req.ip));
  }),
  cambiarEstado: asyncHandler(async (req, res) => {
    const { estado } = validar(estadoDto, req.body);
    res.json(await rolService.cambiarEstado(usuarioActual(req), idDe(req), estado, req.ip));
  }),
};
