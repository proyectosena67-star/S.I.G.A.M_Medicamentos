import { useState } from "react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { loteService } from "../services/loteService";

export default function LoteForm({ lote, medicamentos = [], onCerrar, onGuardado }) {
  const [formData, setFormData] = useState({
    id_medicamento: lote?.id_medicamento || "",
    numero_lote: lote?.numero_lote || "",
    stock_actual: lote?.stock_actual || "",
    fecha_vencimiento: lote?.fecha_vencimiento || "",
  });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    try {
      if (lote) {
        await loteService.actualizar(lote.id_lote, formData);
        onGuardado(true, "actualizado");
      } else {
        await loteService.crear(formData);
        onGuardado(true, "creado");
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error al guardar el lote.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "28px", borderRadius: "16px", width: "100%", maxWidth: "480px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", border: "1px solid #cbd5e1" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            {lote ? "Editar Lote" : "Registrar Nuevo Lote"}
          </h2>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>✕</button>
        </div>

        {error && <div style={{ marginBottom: "16px", padding: "10px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontSize: "13px" }}>{error}</div>}

        <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Medicamento</label>
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
                  {med.nombre_comercial || med.nombre_generico} ({med.codigo_cums})
                </option>
              ))}
            </select>
          </div>

          <Input
            etiqueta="Número de Lote"
            name="numero_lote"
            placeholder="Ej: LOTE-2026-99"
            value={formData.numero_lote}
            onChange={manejarCambio}
            required
          />

          <Input
            etiqueta="Stock Actual en Lote"
            name="stock_actual"
            type="number"
            placeholder="Ej: 150"
            value={formData.stock_actual}
            onChange={manejarCambio}
            required
          />

          <Input
            etiqueta="Fecha de Vencimiento"
            name="fecha_vencimiento"
            type="date"
            value={formData.fecha_vencimiento}
            onChange={manejarCambio}
            required
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <Button variante="secundario" type="button" onClick={onCerrar}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar Lote"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}