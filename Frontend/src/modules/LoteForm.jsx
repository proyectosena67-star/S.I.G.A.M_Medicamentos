import { useEffect, useState } from "react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { loteService } from "../services/loteService";

// Catálogos estáticos basados en tus tablas de PostgreSQL para garantizar disponibilidad inmediata
const VIAS_ADMINISTRACION = [
  { id: 1, nombre: "Oral" },
  { id: 2, nombre: "Intramuscular" },
  { id: 3, nombre: "Intravenosa" },
  { id: 4, nombre: "Subcutánea" },
  { id: 5, nombre: "Tópica" },
  { id: 6, nombre: "Inhalatoria" },
  { id: 7, nombre: "Sublingual" },
  { id: 8, nombre: "Rectal" },
];

const PRESENTACIONES = [
  { id: 1, nombre: "tableta 1.000 mg" },
  { id: 2, nombre: "tableta 500 mg" },
  { id: 3, nombre: "inyección 10 cc" },
  { id: 4, nombre: "pomada 30 g" },
  { id: 5, nombre: "spray 100 ml" },
];

export default function LoteForm({ lote, medicamentos = [], onCerrar, onGuardado }) {
  const [formData, setFormData] = useState({
    id_medicamento: "",
    id_via: "",
    id_presentacion: "",
    num_lote: "",
    stock_actual: "",
    fecha_vence: "",
  });

  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (lote) {
      let fechaFormateada = lote.fecha_vence || "";
      if (fechaFormateada.includes("T")) {
        fechaFormateada = fechaFormateada.split("T")[0];
      }

      setFormData({
        id_medicamento: lote.id_medicamento || "",
        id_via: lote.id_via || "",
        id_presentacion: lote.id_presentacion || "",
        num_lote: lote.num_lote || "",
        stock_actual: lote.stock_actual !== undefined ? lote.stock_actual : "",
        fecha_vence: fechaFormateada,
      });
    }
  }, [lote]);

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    try {
      let fechaLimpia = formData.fecha_vence;
      if (fechaLimpia && fechaLimpia.includes("/")) {
        const partes = fechaLimpia.split("/");
        if (partes.length === 3) {
          fechaLimpia = `${partes[2]}-${partes[1].padStart(2, "0")}-${partes[0].padStart(2, "0")}`;
        }
      } else if (fechaLimpia && fechaLimpia.includes("T")) {
        fechaLimpia = fechaLimpia.split("T")[0];
      }

      const datosAEnviar = {
        id_medicamento: Number(formData.id_medicamento),
        id_via: Number(formData.id_via),
        id_presentacion: Number(formData.id_presentacion),
        num_lote: formData.num_lote.trim(),
        stock_actual: Number(formData.stock_actual),
        fecha_vence: fechaLimpia,
      };

      if (lote?.id_lote) {
        await loteService.actualizar(lote.id_lote, datosAEnviar);
        onGuardado(true, "actualizado");
      } else {
        await loteService.crear(datosAEnviar);
        onGuardado(true, "creado");
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar el lote.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "28px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          border: "1px solid #cbd5e1",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            {lote ? "Editar Lote" : "Registrar Nuevo Lote"}
          </h2>
          <button
            onClick={onCerrar}
            style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px",
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Medicamento
            </label>
            <select
              name="id_medicamento"
              value={formData.id_medicamento}
              onChange={manejarCambio}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", backgroundColor: "#fff" }}
            >
              <option value="">Seleccione un medicamento...</option>
              {medicamentos.map((med) => (
                <option key={med.id_medicamento} value={med.id_medicamento}>
                  {med.nombre_comercial || med.nombre_generico}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Vía de Administración
            </label>
            <select
              name="id_via"
              value={formData.id_via}
              onChange={manejarCambio}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", backgroundColor: "#fff" }}
            >
              <option value="">Seleccione la vía...</option>
              {VIAS_ADMINISTRACION.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>
              Presentación
            </label>
            <select
              name="id_presentacion"
              value={formData.id_presentacion}
              onChange={manejarCambio}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", backgroundColor: "#fff" }}
            >
              <option value="">Seleccione presentación...</option>
              {PRESENTACIONES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <Input
            etiqueta="Número de Lote"
            name="num_lote"
            type="text"
            placeholder="Ej: L-2026-03"
            value={formData.num_lote}
            onChange={manejarCambio}
            required
          />

          <Input
            etiqueta="Stock Actual en Lote"
            name="stock_actual"
            type="number"
            placeholder="Ej: 100"
            value={formData.stock_actual}
            onChange={manejarCambio}
            required
          />

          <Input
            etiqueta="Fecha de Vencimiento"
            name="fecha_vence"
            type="date"
            value={formData.fecha_vence}
            onChange={manejarCambio}
            required
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <Button variante="secundario" type="button" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar Lote"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}