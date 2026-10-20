import { crearOrdenDto, editarOrdenDto, estadoOrdenDto, filtrosOrdenDto } from '../dtos/orden.dto';
import { validar } from '../dtos/validar';
import { ordenService } from '../services/orden.service';
import { asyncHandler, idDe, usuarioActual } from '../utils/http';

export const ordenController = {
  listar: asyncHandler(async (req, res) => {
    res.json(await ordenService.listar(validar(filtrosOrdenDto, req.query)));
  }),
  obtener: asyncHandler(async (req, res) => {
    res.json(await ordenService.obtener(idDe(req)));
  }),
  crear: asyncHandler(async (req, res) => {
    res.status(201).json(await ordenService.crear(usuarioActual(req), validar(crearOrdenDto, req.body), req.ip));
  }),
  editar: asyncHandler(async (req, res) => {
    res.json(await ordenService.editar(usuarioActual(req), idDe(req), validar(editarOrdenDto, req.body), req.ip));
  }),
  cambiarEstado: asyncHandler(async (req, res) => {
    res.json(await ordenService.cambiarEstado(usuarioActual(req), idDe(req), validar(estadoOrdenDto, req.body), req.ip));
  }),
};
