import { z } from "zod";
import { texto } from "./comun.dto";

export const esquemaCrearVia = z.object({ nombre: texto(2, 60) });
export type CrearViaDto = z.infer<typeof esquemaCrearVia>;

export const esquemaActualizarVia = esquemaCrearVia;
export type ActualizarViaDto = z.infer<typeof esquemaActualizarVia>;
