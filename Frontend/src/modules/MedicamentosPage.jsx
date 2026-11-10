import { useEffect, useState } from "react";
import Alert from "../components/UI/Alert";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { medicamentoService } from "../services/medicamentoService";
import MedicamentoForm from "./MedicamentoForm";

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const cargarMedicamentos = async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await medicamentoService.listar();
      setMedicamentos(datos);
    } catch (fallo) {
      setError(fallo.message || "No se pudieron cargar los medicamentos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const medicamentosFiltrados = medicamentos.filter((med) => {
    const texto = busqueda.toLowerCase();
    return (
      med.codigo_cums?.toLowerCase().includes(texto) ||
      med.nombre_generico?.toLowerCase().includes(texto) ||
      med.nombre_comercial?.toLowerCase().includes(texto)
    );
  });

  function alAbrirCrear() {
    setMedicamentoSeleccionado(null);
    setModalAbierto(true);
  }

  function alAbrirEditar(medicamento) {
    setMedicamentoSeleccionado(medicamento);
    setModalAbierto(true);
  }

  function alGuardar(guardado, accion) {
    setModalAbierto(false);
    setMedicamentoSeleccionado(null);
    cargarMedicamentos();
    setMensajeExito(
      accion === "creado"
        ? "Medicamento registrado con éxito."
        : "Medicamento actualizado con éxito."
    );
    setTimeout(() => setMensajeExito(""), 4000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", backgroundColor: "#f1f5f9", padding: "24px", minHeight: "100vh", borderRadius: "16px" }}>
      {/* Cabecera Principal */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        backgroundColor: "#ffffff", 
        padding: "20px 24px", 
        borderRadius: "12px", 
        border: "1px solid #cbd5e1",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
      }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Medicamentos
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
            Administración del catálogo de medicamentos e inventario base.
          </p>
        </div>
        <Button onClick={alAbrirCrear} style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          + Nuevo medicamento
        </Button>
      </div>

      {mensajeExito && <Alert tono="exito">{mensajeExito}</Alert>}
      {error && <Alert tono="error">{error}</Alert>}

      {/* Tarjeta de Búsqueda */}
      <div style={{ 
        backgroundColor: "#ffffff", 
        padding: "16px 24px", 
        borderRadius: "12px", 
        border: "1px solid #cbd5e1",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ width: "350px", maxWidth: "100%" }}>
          <Input
            etiqueta="Buscar medicamento"
            placeholder="Código CUMS, genérico o comercial..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
          Mostrando {medicamentosFiltrados.length} de {medicamentos.length} medicamentos
        </div>
      </div>

      {/* Grid de Tarjetas de Medicamentos */}
      {cargando ? (
        <div style={{ backgroundColor: "#ffffff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#94a3b8" }}>
          Cargando medicamentos...
        </div>
      ) : medicamentosFiltrados.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {medicamentosFiltrados.map((med) => (
            <div
              key={med.id_medicamento}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #cbd5e1", // Borde más marcado para separar del fondo
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", // Sombra más definida
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "14px"
              }}
            >
              {/* Encabezado de la Tarjeta */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                    {med.nombre_comercial || med.nombre_generico}
                  </h3>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: "600", color: "#2d5faa", backgroundColor: "#f0f4f8", padding: "2px 6px", borderRadius: "4px", border: "1px solid #cbd5e1" }}>
                    {med.codigo_cums}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: "#64748b", margin: "4px 0 0 0" }}>
                  Genérico: <strong>{med.nombre_generico}</strong>
                </p>
              </div>

              {/* Información detallada en bloque con mejor contraste */}
              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12.5px", color: "#475569" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Tipo:</span>
                  <strong style={{ color: "#334155" }}>{med.tipo_medicamento}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Stock Mínimo:</span>
                  <strong style={{ color: "#334155" }}>{med.stock_minimo} un.</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Controlado:</span>
                  <span style={{ fontWeight: "600", color: med.es_controlado ? "#7e22ce" : "#475569" }}>
                    {med.es_controlado ? "Sí" : "No"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px", borderTop: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b" }}>Estado:</span>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "600",
                      backgroundColor: med.estado ? "#d1fae5" : "#ffe4e6",
                      color: med.estado ? "#047857" : "#be123c",
                    }}
                  >
                    {med.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              {/* Botón de acción */}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
                <Button
                  variante="secundario"
                  style={{ fontSize: "12px", padding: "6px 16px" }}
                  onClick={() => alAbrirEditar(med)}
                >
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: "#ffffff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#94a3b8" }}>
          No se encontraron medicamentos registrados.
        </div>
      )}

      {/* Modal Formulario */}
      {modalAbierto && (
        <MedicamentoForm
          medicamento={medicamentoSeleccionado}
          onCerrar={() => setModalAbierto(false)}
          onGuardado={alGuardar}
        />
      )}
    </div>
  );
}