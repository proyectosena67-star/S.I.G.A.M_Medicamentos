import { esquemaCambioEstado } from "../dtos/comun.dto";
import { esquemaActualizarUsuario, esquemaCrearUsuario } from "../dtos/usuario.dto";
import { validar } from "./validar.middleware";

export const validarCrearUsuario = validar(esquemaCrearUsuario);
export const validarActualizarUsuario = validar(esquemaActualizarUsuario);
export const validarEstadoUsuario = validar(esquemaCambioEstado);
