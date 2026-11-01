import { z } from "zod";
import { correo } from "./comun.dto";

export const esquemaLogin = z.object({
  correo,
  password: z.string().min(1, "La contraseña es obligatoria"),
});
export type LoginDto = z.infer<typeof esquemaLogin>;

export const esquemaCambiarPassword = z.object({
  password_actual: z.string().min(1, "La contraseña actual es obligatoria"),
  password_nueva: z
    .string()
    .min(10, "Mínimo 10 caracteres")
    .max(72, "Máximo 72 caracteres")
    .regex(/[a-z]/, "Debe incluir una minúscula")
    .regex(/[A-Z]/, "Debe incluir una mayúscula")
    .regex(/[0-9]/, "Debe incluir un número")
    .regex(/[^A-Za-z0-9]/, "Debe incluir un símbolo"),
});
export type CambiarPasswordDto = z.infer<typeof esquemaCambiarPassword>;
