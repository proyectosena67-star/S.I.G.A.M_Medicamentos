import { esquemaCambioEstado } from "../dtos/comun.dto";
import { esquemaActualizarPaciente, esquemaCrearPaciente } from "../dtos/paciente.dto";
import { validar } from "./validar.middleware";

export const validarCrearPaciente = validar(esquemaCrearPaciente);
export const validarActualizarPaciente = validar(esquemaActualizarPaciente);
export const validarEstadoPaciente = validar(esquemaCambioEstado);
