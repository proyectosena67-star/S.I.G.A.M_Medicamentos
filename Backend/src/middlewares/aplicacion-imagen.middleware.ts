import { esquemaCrearImagen } from "../dtos/aplicacion-imagen.dto";
import { validar } from "./validar.middleware";

export const validarCrearImagen = validar(esquemaCrearImagen);
