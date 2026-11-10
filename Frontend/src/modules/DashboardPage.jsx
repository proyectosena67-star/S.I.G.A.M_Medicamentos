import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { menuParaRol } from "../utils/modulos";

export default function DashboardPage() {
  const { usuario } = useAuth();
  const accesos = menuParaRol(usuario.rol).filter((elemento) => elemento.to !== "/");

  return (
    <div className="pagina">
      <h1>Hola, {usuario.nombres}</h1>
      <p className="pagina__sub">Tu rol es {usuario.rol}. Desde aquí puedes entrar a:</p>
      <ul className="accesos">
        {accesos.map((acceso) => (
          <li key={acceso.to}>
            <Link to={acceso.to}>{acceso.etiqueta}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
