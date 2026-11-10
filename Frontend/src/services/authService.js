import { api } from "./api";

export const authService = {
  /** Devuelve { token, usuario } */
  iniciarSesion: (correo, password) => api.post("/auth/login", { correo, password }),

  /** Datos de la persona con la sesión iniciada (incluye su rol). */
  perfil: () => api.get("/auth/me"),

  cambiarPassword: (password_actual, password_nueva) =>
    api.post("/auth/cambiar-password", { password_actual, password_nueva }),
};
