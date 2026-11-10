import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import Alert from "../components/UI/Alert";
import { useAuth } from "../hooks/useAuth";
import DashboardPage from "../modules/DashboardPage";
import DispensacionesPage from "../modules/DispensacionesPage";
import LotesPage from "../modules/LotesPage";
import LoginPage from "../modules/LoginPage";
import MedicamentosPage from "../modules/MedicamentosPage";
import OrdenesPage from "../modules/OrdenesPage";
import PacientesPage from "../modules/PacientesPage";
import { MODULOS, menuParaRol } from "../utils/modulos";
import PaginaPendiente from "./PaginaPendiente";
import RutaProtegida from "./RutaProtegida";

const PAGINAS = {
  "/pacientes": PacientesPage,
  "/medicamentos": MedicamentosPage,
  "/lotes": LotesPage,
  "/dispensaciones": DispensacionesPage,
  "/ordenes": OrdenesPage, // <--- ¡Añadido aquí correctamente!
};

function LayoutConSesion() {
  const { usuario, cerrarSesion } = useAuth();
  return <MainLayout menu={menuParaRol(usuario.rol)} usuario={usuario} onSalir={cerrarSesion} />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RutaProtegida />}>
          <Route element={<LayoutConSesion />}>
            <Route index element={<DashboardPage />} />

            {MODULOS.map((modulo) => {
              const Pagina = PAGINAS[modulo.ruta];
              return (
                <Route key={modulo.ruta} element={<RutaProtegida roles={modulo.roles} />}>
                  <Route
                    path={modulo.ruta}
                    element={Pagina ? <Pagina /> : <PaginaPendiente titulo={modulo.titulo} />}
                  />
                </Route>
              );
            })}

            <Route path="*" element={<Alert tono="aviso" titulo="Esta página no existe" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}