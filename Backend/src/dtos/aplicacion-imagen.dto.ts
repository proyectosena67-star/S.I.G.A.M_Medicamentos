import { z } from "zod";

export const esquemaCrearImagen = z.object({
  url: z.string().trim().url("Debe ser una URL válida").max(500),
});
export type CrearImagenDto = z.infer<typeof esquemaCrearImagen>;
