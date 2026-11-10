import { useEffect, useState } from "react";
import Alert from "../components/UI/Alert";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { loteService } from "../services/loteService";
import { medicamentoService } from "../services/medicamentoService";
import LoteForm from "./LoteForm";

export default function LotesPage() {
  const [lotes, setLotes] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const cargarDatos = async () => {
    setCargando(true);
    setError("");
    try {
      const [datosLotes, datosMeds] = await Promise.all([
        loteService.listar(),
        medicamentoService.listar()
      ]);
      setLotes(datosLotes);
      setMedicamentos(datosMeds);
    } catch (fallo) {
      setError(fallo.message || "No se pudieron cargar los datos de lotes.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const lotesFiltrados = lotes.filter((lote) => {
    const texto = busqueda.toLowerCase();
    return (
      lote.numero_lote?.toLowerCase().includes(texto) ||
      lote.medicamento?.nombre_generico?.toLowerCase().includes(texto) ||
      lote.medicamento?.codigo_cums?.toLowerCase().includes(texto)
    );
  });

  function alAbrirCrear() {
    setLoteSeleccionado(null);
    setModalAbierto(true);
  }

  function alAbrirEditar(lote) {
    setLoteSeleccionado(lote);
    setModalAbierto(true);
  }

  function alGuardar(guardado, accion) {
    setModalAbierto(false);
    setLoteSeleccionado(null);
    cargarDatos();
    setMensajeExito(
      accion === "creado"
        ? "Lote registrado con éxito."
        : "Lote actualizado con éxito."
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
            Control de Lotes
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
            Seguimiento de existencias, fechas de vencimiento y trazabilidad por lote.
          </p>
        </div>
        <Button onClick={alAbrirCrear} style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          + Nuevo lote
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
            etiqueta="Buscar lote"
            placeholder="Nº de lote, medicamento o CUMS..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
          Mostrando {lotesFiltrados.length} de {lotes.length} lotes
        </div>
      </div>

      {/* Grid de Tarjetas de Lotes */}
      {cargando ? (
        <div style={{ backgroundColor: "#ffffff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#94a3b8" }}>
          Cargando lotes...
        </div>
      ) : lotesFiltrados.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {lotesFiltrados.map((lote) => (
            <div
              key={lote.id_lote}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
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
                    {lote.medicamento?.nombre_comercial || lote.medicamento?.nombre_generico || "Medicamento"}
                  </h3>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: "600", color: "#2d5faa", backgroundColor: "#f0f4f8", padding: "2px 6px", borderRadius: "4px", border: "1px solid #cbd5e1" }}>
                    {lote.numero_lote}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: "#64748b", margin: "4px 0 0 0" }}>
                  Genérico: <strong>{lote.medicamento?.nombre_generico}</strong>
                </p>
              </div>

              {/* Información detallada del lote */}
              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12.5px", color: "#475569" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Stock Actual:</span>
                  <strong style={{ color: "#0f172a" }}>{lote.stock_actual} unidades</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px", borderTop: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b" }}>Vencimiento:</span>
                  <span style={{ fontWeight: "600", color: "#0369a1", backgroundColor: "#e0f2fe", padding: "2px 8px", borderRadius: "6px", fontSize: "11.5px" }}>
                    {lote.fecha_vencimiento}
                  </span>
                </div>
              </div>

              {/* Botón de acción */}
              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
                <Button
                  variante="secundario"
                  style={{ fontSize: "12px", padding: "6px 16px" }}
                  onClick={() => alAbrirEditar(lote)}
                >
                  Editar Lote
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: "#ffffff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#94a3b8" }}>
          No se encontraron lotes registrados.
        </div>
      )}

      {/* Modal Formulario */}
      {modalAbierto && (
        <LoteForm
          lote={loteSeleccionado}
          medicamentos={medicamentos}
          onCerrar={() => setModalAbierto(false)}
          onGuardado={alGuardar}
        />
      )}
    </div>
  );
}