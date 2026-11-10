import { NavLink } from "react-router-dom";

/**
 * Menú lateral.
 * elementos: [{ to: "/pacientes", etiqueta: "Pacientes", end: false }]
 * El menú que recibe depende del rol de la persona (se arma en utils/modulos.js).
 */
export default function Sidebar({ elementos = [], abierto = false, onCerrar }) {
  return (
    <>
      {abierto && <div className="sidebar-velo" onClick={onCerrar} aria-hidden="true" />}
      <aside className={`sidebar ${abierto ? "sidebar--abierto" : ""}`.trim()}>
        <nav aria-label="Principal">
          <ul className="sidebar__lista">
            {elementos.map((elemento) => (
              <li key={elemento.to}>
                <NavLink
                  to={elemento.to}
                  end={elemento.end}
                  onClick={onCerrar}
                  className={({ isActive }) =>
                    `sidebar__enlace ${isActive ? "sidebar__enlace--activo" : ""}`.trim()
                  }
                >
                  {elemento.etiqueta}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
