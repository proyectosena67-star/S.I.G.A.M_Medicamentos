import { actualizarPerfilDto, cambiarPasswordDto, loginDto } from '../dtos/auth.dto';
import { validar } from '../dtos/validar';
import { authService } from '../services/auth.service';
import { asyncHandler, usuarioActual } from '../utils/http';

export const authController = {
  login: asyncHandler(async (req, res) => {
    res.json(await authService.login(validar(loginDto, req.body), req.ip));
  }),
  logout: asyncHandler(async (req, res) => {
    res.json(await authService.logout(usuarioActual(req), req.ip));
  }),
  perfil: asyncHandler(async (req, res) => {
    res.json(await authService.perfil(usuarioActual(req)));
  }),
  actualizarPerfil: asyncHandler(async (req, res) => {
    res.json(await authService.actualizarPerfil(usuarioActual(req), validar(actualizarPerfilDto, req.body), req.ip));
  }),
  cambiarPassword: asyncHandler(async (req, res) => {
    res.json(await authService.cambiarPassword(usuarioActual(req), validar(cambiarPasswordDto, req.body), req.ip));
  }),
};
