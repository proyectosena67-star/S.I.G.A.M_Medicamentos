import { UsuarioAutenticado } from "../models/auth.model";

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioAutenticado;
    }
  }
}

export {};
