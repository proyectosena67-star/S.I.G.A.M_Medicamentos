import { useEffect, useState } from "react";
import Alert from "../components/UI/Alert";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { dispensacionService } from "../services/dispensacionService";
import { formatearFecha } from "../utils/formatos";
import DispensacionForm from "./DispensacionForm";

export default function DispensacionesPage() {
  const [dispensaciones, setDispensaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const cargarDatos = async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await dispensacionService.listar();
      setDispensaciones(Array.isArray(datos) ? datos : []);
    } catch (fallo) {
      setError(fallo.message || "No se pudieron cargar los datos de dispensaciones.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const dispensacionesFiltradas = dispensaciones.filter((item) => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return true;
    
    // Basado en los campos que devuelve tu API (medicamento, num_lote, farmaceutica, etc.)
    return [
      item.medicamento,
      item.num_lote,
      item.farmaceutica || item.farmaceuta,
      item.observaciones
    ].some((campo) => String(campo ?? "").toLowerCase().includes(texto));
  });

  function alAbrirCrear() {
    setModalAbierto(true);
  }

  function alGuardar(guardado) {
    setModalAbierto(false);
    cargarDatos();
    setMensajeExito("Dispensación registrada con éxito.");
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
            Control de Dispensaciones
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
            Registro de entregas de medicamentos, trazabilidad por lote y control de salidas.
          </p>
        </div>
        <Button onClick={alAbrirCrear} style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          + Nueva dispensación
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
            etiqueta="Buscar dispensación"
            placeholder="Medicamento, lote o farmaceuta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
          Mostrando {dispensacionesFiltradas.length} de {dispensaciones.length} dispensaciones
        </div>
      </div>

      {/* Grid de Tarjetas de Dispensaciones */}
      {cargando ? (
        <div style={{ backgroundColor: "#ffffff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#94a3b8" }}>
          Cargando dispensaciones...
        </div>
      ) : dispensacionesFiltradas.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {dispensacionesFiltradas.map((item) => (
            <div
              key={item.id_dispensacion}
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
                    {item.medicamento || "Medicamento"}
                  </h3>
                  <span style={{ fontSize: "11px", fontFamily: "monospace", fontWeight: "600", color: "#2d5faa", backgroundColor: "#f0f4f8", padding: "2px 6px", borderRadius: "4px", border: "1px solid #cbd5e1" }}>
                    {item.num_lote || "S/L"}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: "#64748b", margin: "4px 0 0 0" }}>
                  Farmaceuta: <strong>{item.farmaceutica || item.farmaceuta || "N/A"}</strong>
                </p>
              </div>

              {/* Información detallada de la dispensación */}
              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12.5px", color: "#475569" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748b" }}>Cantidad Entregada:</span>
                  <strong style={{ color: "#0f172a" }}>{item.cantidad_entregada} unidades</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px", borderTop: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b" }}>Fecha Dispensación:</span>
                  <span style={{ fontWeight: "600", color: "#0369a1", backgroundColor: "#e0f2fe", padding: "2px 8px", borderRadius: "6px", fontSize: "11.5px" }}>
                    {formatearFecha(item.fecha_dispensacion)}
                  </span>
                </div>
              </div>

              {/* Pie de tarjeta con nota informativa o badge sutil */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px", fontSize: "11.5px", color: "#64748b" }}>
                <span>ID Detalle Orden: #{item.id_detalle_orden}</span>
                <span style={{ fontWeight: "600", color: "#16a34a" }}>Completado</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: "#ffffff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#94a3b8" }}>
          {busqueda ? "Ninguna dispensación coincide con la búsqueda." : "No se encontraron dispensaciones registradas."}
        </div>
      )}

      {/* Modal Formulario de Dispensación */}
      {modalAbierto && (
        <DispensacionForm
          onCerrar={() => setModalAbierto(false)}
          onGuardado={alGuardar}
        />
      )}
    </div>
  );
}