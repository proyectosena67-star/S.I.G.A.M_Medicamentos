import { esquemaCambiarPassword, esquemaLogin } from "../dtos/auth.dto";
import { validar } from "./validar.middleware";

export const validarLogin = validar(esquemaLogin);
export const validarCambioPassword = validar(esquemaCambiarPassword);
