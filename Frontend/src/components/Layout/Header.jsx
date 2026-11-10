import Button from "../UI/Button";
import Logo from "../UI/Logo";

/**
 * Franja azul superior: marca, la persona que tiene la sesión y el botón de salir.
 * usuario: { nombres, apellidos, rol }
 */
export default function Header({ usuario, onMenu, onSalir }) {
  return (
    <header className="encabezado">
      <button type="button" className="encabezado__menu" onClick={onMenu} aria-label="Abrir menú">
        <span aria-hidden="true">☰</span>
      </button>
      <div className="encabezado__marca">
        <Logo variante="claro" />
      </div>
      {usuario && (
        <div className="encabezado__usuario">
          <span className="encabezado__nombre">
            {usuario.nombres} {usuario.apellidos}
          </span>
          <span className="encabezado__rol">{usuario.rol}</span>
        </div>
      )}
      <Button variante="claro" tamano="sm" onClick={onSalir}>
        Cerrar sesión
      </Button>
    </header>
  );
}
