import { esquemaCambioEstado } from "../dtos/comun.dto";
import { esquemaActualizarMedicamento, esquemaCrearMedicamento } from "../dtos/medicamento.dto";
import { validar } from "./validar.middleware";

export const validarCrearMedicamento = validar(esquemaCrearMedicamento);
export const validarActualizarMedicamento = validar(esquemaActualizarMedicamento);
export const validarEstadoMedicamento = validar(esquemaCambioEstado);
