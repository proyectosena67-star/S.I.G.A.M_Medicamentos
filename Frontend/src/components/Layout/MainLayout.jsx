import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

/**
 * Estructura de todas las pantallas con sesión: franja azul superior + menú lateral + contenido + franja inferior.
 * Se usa como ruta padre: las pantallas de cada módulo se dibujan donde está <Outlet />.
 */
export default function MainLayout({ menu = [], usuario, onSalir }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="layout">
      <a className="saltar" href="#contenido">
        Ir al contenido
      </a>
      <Header usuario={usuario} onMenu={() => setMenuAbierto(true)} onSalir={onSalir} />
      <Sidebar elementos={menu} abierto={menuAbierto} onCerrar={() => setMenuAbierto(false)} />
      <div className="layout__principal">
        <main id="contenido" className="layout__contenido">
          <Outlet />
        </main>
        <footer className="pie-pagina">S.I.G.A.M. · Sistema integral de gestión y administración médica</footer>
      </div>
    </div>
  );
}
