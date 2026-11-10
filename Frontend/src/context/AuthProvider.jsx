import { useCallback, useEffect, useMemo, useState } from "react";
import { EVENTO_SESION_EXPIRADA, token } from "../services/api";
import { authService } from "../services/authService";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  // Si hay un token guardado, hay que verificarlo con el servidor antes de mostrar nada.
  const [cargando, setCargando] = useState(() => Boolean(token.obtener()));

  useEffect(() => {
    if (!token.obtener()) return undefined;
    let activo = true;
    authService
      .perfil()
      .then((datos) => activo && setUsuario(datos))
      .catch(() => token.borrar())
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  // api.js avisa con este evento cuando el servidor rechaza el token.
  useEffect(() => {
    const alExpirar = () => setUsuario(null);
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar);
  }, []);

  const iniciarSesion = useCallback(async (correo, password) => {
    const respuesta = await authService.iniciarSesion(correo, password);
    token.guardar(respuesta.token);
    setUsuario(respuesta.usuario);
    return respuesta.usuario;
  }, []);

  const cerrarSesion = useCallback(() => {
    token.borrar();
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, cargando, iniciarSesion, cerrarSesion }),
    [usuario, cargando, iniciarSesion, cerrarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
