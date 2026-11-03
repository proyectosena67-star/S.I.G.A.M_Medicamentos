import { esquemaAsignarEnfermero, esquemaFiltrosAplicacion, esquemaRegistrarAplicacion } from "../dtos/aplicacion.dto";
import { validar } from "./validar.middleware";

export const validarAsignarEnfermero = validar(esquemaAsignarEnfermero);
export const validarRegistrarAplicacion = validar(esquemaRegistrarAplicacion);
export const validarFiltrosAplicacion = validar(esquemaFiltrosAplicacion, "query");
