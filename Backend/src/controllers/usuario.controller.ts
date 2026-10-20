import { estadoDto } from '../dtos/common.dto';
import { actualizarUsuarioDto, crearUsuarioDto, filtrosUsuarioDto } from '../dtos/usuario.dto';
import { validar } from '../dtos/validar';
import { usuarioService } from '../services/usuario.service';
import { asyncHandler, idDe, usuarioActual } from '../utils/http';

export const usuarioController = {
  listar: asyncHandler(async (req, res) => {
    res.json(await usuarioService.listar(validar(filtrosUsuarioDto, req.query)));
  }),
  obtener: asyncHandler(async (req, res) => {
    res.json(await usuarioService.obtener(idDe(req)));
  }),
  crear: asyncHandler(async (req, res) => {
    res.status(201).json(await usuarioService.crear(usuarioActual(req), validar(crearUsuarioDto, req.body), req.ip));
  }),
  actualizar: asyncHandler(async (req, res) => {
    res.json(await usuarioService.actualizar(usuarioActual(req), idDe(req), validar(actualizarUsuarioDto, req.body), req.ip));
  }),
  cambiarEstado: asyncHandler(async (req, res) => {
    const { estado } = validar(estadoDto, req.body);
    res.json(await usuarioService.cambiarEstado(usuarioActual(req), idDe(req), estado, req.ip));
  }),
  restablecerPassword: asyncHandler(async (req, res) => {
    res.json(await usuarioService.restablecerPassword(usuarioActual(req), idDe(req), req.ip));
  }),
};
