import { estadoDto } from '../dtos/common.dto';
import {
  actualizarMedicamentoDto, crearMedicamentoDto, filtrosMedicamentoDto,
} from '../dtos/medicamento.dto';
import { validar } from '../dtos/validar';
import { medicamentoService } from '../services/medicamento.service';
import { asyncHandler, idDe, usuarioActual } from '../utils/http';

export const medicamentoController = {
  listar: asyncHandler(async (req, res) => {
    res.json(await medicamentoService.listar(validar(filtrosMedicamentoDto, req.query)));
  }),
  obtener: asyncHandler(async (req, res) => {
    res.json(await medicamentoService.obtener(idDe(req)));
  }),
  crear: asyncHandler(async (req, res) => {
    res.status(201).json(await medicamentoService.crear(usuarioActual(req), validar(crearMedicamentoDto, req.body), req.ip));
  }),
  actualizar: asyncHandler(async (req, res) => {
    res.json(await medicamentoService.actualizar(usuarioActual(req), idDe(req), validar(actualizarMedicamentoDto, req.body), req.ip));
  }),
  cambiarEstado: asyncHandler(async (req, res) => {
    const { estado } = validar(estadoDto, req.body);
    res.json(await medicamentoService.cambiarEstado(usuarioActual(req), idDe(req), estado, req.ip));
  }),
};
