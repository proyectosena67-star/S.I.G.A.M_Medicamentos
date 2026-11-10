import { Navigate, Outlet, useLocation } from "react-router-dom";
import Alert from "../components/UI/Alert";
import Spinner from "../components/UI/Spinner";
import { useAuth } from "../hooks/useAuth";

/**
 * Deja pasar solo a quien tiene la sesión iniciada.
 * Con la propiedad "roles" además exige que el rol de la persona esté en la lista.
 */
export default function RutaProtegida({ roles }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) {
    return (
      <div className="pantalla-centrada">
        <Spinner etiqueta="Verificando la sesión" />
      </div>
    );
  }

  if (!usuario) return <Navigate to="/login" replace state={{ desde: ubicacion }} />;

  if (roles && !roles.includes(usuario.rol)) {
    return (
      <Alert tono="aviso" titulo="No tienes acceso a esta sección">
        Tu rol ({usuario.rol}) no incluye este módulo.
      </Alert>
    );
  }

  return <Outlet />;
}
