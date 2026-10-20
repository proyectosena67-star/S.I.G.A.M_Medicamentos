import { estadoDto } from '../dtos/common.dto';
import {
  actualizarPacienteDto, crearPacienteDto, filtrosHistorialDto, filtrosPacienteDto,
} from '../dtos/paciente.dto';
import { validar } from '../dtos/validar';
import { historialService } from '../services/historial.service';
import { pacienteService } from '../services/paciente.service';
import { asyncHandler, idDe, usuarioActual } from '../utils/http';

export const pacienteController = {
  listar: asyncHandler(async (req, res) => {
    res.json(await pacienteService.listar(validar(filtrosPacienteDto, req.query)));
  }),
  obtener: asyncHandler(async (req, res) => {
    res.json(await pacienteService.obtener(idDe(req)));
  }),
  historial: asyncHandler(async (req, res) => {
    res.json(await historialService.delPaciente(idDe(req), validar(filtrosHistorialDto, req.query)));
  }),
  crear: asyncHandler(async (req, res) => {
    res.status(201).json(await pacienteService.crear(usuarioActual(req), validar(crearPacienteDto, req.body), req.ip));
  }),
  actualizar: asyncHandler(async (req, res) => {
    res.json(await pacienteService.actualizar(usuarioActual(req), idDe(req), validar(actualizarPacienteDto, req.body), req.ip));
  }),
  cambiarEstado: asyncHandler(async (req, res) => {
    const { estado } = validar(estadoDto, req.body);
    res.json(await pacienteService.cambiarEstado(usuarioActual(req), idDe(req), estado, req.ip));
  }),
};
