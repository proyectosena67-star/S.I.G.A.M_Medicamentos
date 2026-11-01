import { esquemaActualizarLote, esquemaCrearLote } from "../dtos/lote-medicamento.dto";
import { validar } from "./validar.middleware";

export const validarCrearLote = validar(esquemaCrearLote);
export const validarActualizarLote = validar(esquemaActualizarLote);
