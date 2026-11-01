import { esquemaCambiarEstadoOrden, esquemaCrearOrden, esquemaFiltrosOrden } from "../dtos/orden-medica.dto";
import { validar } from "./validar.middleware";

export const validarCrearOrden = validar(esquemaCrearOrden);
export const validarEstadoOrden = validar(esquemaCambiarEstadoOrden);
export const validarFiltrosOrden = validar(esquemaFiltrosOrden, "query");
