import { esquemaCrearDispensacion, esquemaFiltrosDispensacion } from "../dtos/dispensacion.dto";
import { validar } from "./validar.middleware";

export const validarCrearDispensacion = validar(esquemaCrearDispensacion);
export const validarFiltrosDispensacion = validar(esquemaFiltrosDispensacion, "query");
