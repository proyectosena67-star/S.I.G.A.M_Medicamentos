import { esquemaCambioEstado } from "../dtos/comun.dto";
import { esquemaActualizarVia, esquemaCrearVia } from "../dtos/via-administracion.dto";
import { validar } from "./validar.middleware";

export const validarCrearVia = validar(esquemaCrearVia);
export const validarActualizarVia = validar(esquemaActualizarVia);
export const validarEstadoVia = validar(esquemaCambioEstado);
