import { useEffect, useState } from "react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { api } from "../services/api";
import { dispensacionService } from "../services/dispensacionService";

export default function DispensacionForm({ onCerrar, onGuardado }) {
  const [formData, setFormData] = useState({
    id_detalle_orden: "",
    id_lote: "",
    cantidad_entregada: "",
    observaciones: "",
  });

  const [lotes, setLotes] = useState([]);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cargar lotes disponibles para dispensar
  useEffect(() => {
    api.get("/lotes")
      .then((res) => {
        const dataLotes = res.data || res;
        setLotes(Array.isArray(dataLotes) ? dataLotes : []);
      })
      .catch(() => setLotes([]));
  }, []);

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    try {
      // Convertimos los campos numéricos a Number() para evitar que el backend rechace los tipos de datos
      const datosAEnviar = {
        id_lote: Number(formData.id_lote),
        id_detalle_orden: Number(formData.id_detalle_orden),
        cantidad_entregada: Number(formData.cantidad_entregada),
        observaciones: formData.observaciones || ""
      };

      await dispensacionService.crear(datosAEnviar);
      onGuardado(true, "creado");
    } catch (err) {
      setError(err.message || "Ocurrió un error al registrar la dispensación.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "16px" }}>
      <div style={{ backgroundColor: "#ffffff", padding: "28px", borderRadius: "16px", width: "100%", maxWidth: "500px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)", border: "1px solid #cbd5e1" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Nueva Dispensación de Medicamento
          </h2>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>✕</button>
        </div>

        {error && <div style={{ marginBottom: "16px", padding: "10px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontSize: "13px" }}>{error}</div>}

        <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Lote de Medicamento</label>
            <select
              name="id_lote"
              value={formData.id_lote}
              onChange={manejarCambio}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", backgroundColor: "#fff" }}
            >
              <option value="">Seleccione un lote...</option>
              {lotes.map((lote) => (
                <option key={lote.id_lote} value={lote.id_lote}>
                  Lote: {lote.num_lote} (Stock: {lote.stock_actual})
                </option>
              ))}
            </select>
          </div>

          <Input
            etiqueta="ID Detalle de Orden"
            name="id_detalle_orden"
            type="number"
            placeholder="Ej: 2"
            value={formData.id_detalle_orden}
            onChange={manejarCambio}
            required
          />

          <Input
            etiqueta="Cantidad a Dispensar"
            name="cantidad_entregada"
            type="number"
            placeholder="Ej: 10"
            value={formData.cantidad_entregada}
            onChange={manejarCambio}
            required
          />

          <div>
            <label style={{ display: "block", fontSize: "12.5px", fontWeight: "600", color: "#334155", marginBottom: "6px" }}>Observaciones</label>
            <textarea
              name="observaciones"
              placeholder="Notas adicionales sobre la entrega..."
              value={formData.observaciones}
              onChange={manejarCambio}
              rows="3"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "13.5px", backgroundColor: "#fff", fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <Button variante="secundario" type="button" onClick={onCerrar}>Cancelar</Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Registrando..." : "Completar Dispensación"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}