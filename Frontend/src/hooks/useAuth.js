import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/** Devuelve { usuario, cargando, iniciarSesion, cerrarSesion }. Solo funciona dentro de <AuthProvider>. */
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}
