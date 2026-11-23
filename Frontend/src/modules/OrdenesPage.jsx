import { useEffect, useState } from "react";
import Alert from "../components/UI/Alert";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { ordenService } from "../services/ordenService";
import { useAuth } from "../hooks/useAuth";
import { formatearFecha } from "../utils/formatos";
import OrdenForm from "./OrdenForm";

// Lista de enfermeros disponibles para la asignación
const ENFERMEROS_DISPONIBLES = [
  { id: 10, nombre: "Marta Ríos" },
  { id: 11, nombre: "Juan Camilo Vega" },
  { id: 12, nombre: "Lucía Méndez" },
];

export default function OrdenesPage() {
  const { usuario } = useAuth(); // Usamos tu hook global de autenticación para mayor seguridad
  const [ordenes, setOrdenes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  // Validamos el rol de forma robusta con el usuario autenticado
  const esMedico = usuario?.rol === "Médico" || usuario?.rol === "MEDICO" || usuario?.id_rol === 2;

  const cargarDatos = async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await ordenService.listar();
      let listaOrdenes = Array.isArray(datos) ? datos : [];

      // REQUISITO: Si es médico, filtramos para que solo vea el historial de sus propias órdenes
      if (esMedico && usuario?.id_usuario) {
        listaOrdenes = listaOrdenes.filter(
          (o) => o.id_usuario === usuario.id_usuario || o.medico === `${usuario.nombres} ${usuario.apellidos}`
        );
      }

      setOrdenes(listaOrdenes);
    } catch (fallo) {
      setError(fallo.message || "No se pudieron cargar las órdenes médicas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      cargarDatos();
    }
  }, [usuario]);

  const manejarAsignacion = async (idOrden, idEnfermero) => {
    try {
      // Aquí puedes agregar la llamada a tu servicio para actualizar el enfermero asignado
      setMensajeExito("Orden asignada al enfermero correctamente.");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (err) {
      setError("No se pudo asignar la orden al enfermero.");
    }
  };

  const ordenesFiltradas = ordenes.filter((orden) => {
    const texto = busqueda.toLowerCase().trim();
    if (!texto) return true;
    return [
      orden.paciente,
      orden.medico,
      orden.estado,
      orden.diagnostico
    ].some((campo) => String(campo ?? "").toLowerCase().includes(texto));
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", backgroundColor: "#f1f5f9", padding: "24px", minHeight: "100vh", borderRadius: "16px" }}>
      {/* Cabecera Principal */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ffffff", padding: "20px 24px", borderRadius: "12px", border: "1px solid #cbd5e1", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Historial de Órdenes Médicas
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
            {esMedico 
              ? "Visualiza las prescripciones que has generado y crea nuevas órdenes para tus pacientes." 
              : "Vista de supervisión, seguimiento y asignación de órdenes médicas."}
          </p>
        </div>

        {/* Botón de crear nueva orden exclusivo para el rol de Médico */}
        {esMedico && (
          <Button onClick={() => setModalAbierto(true)}>
            + Crear orden médica
          </Button>
        )}
      </div>

      {mensajeExito && <Alert tono="exito">{mensajeExito}</Alert>}
      {error && <Alert tono="error">{error}</Alert>}

      {/* Búsqueda */}
      <div style={{ backgroundColor: "#ffffff", padding: "16px 24px", borderRadius: "12px", border: "1px solid #cbd5e1", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ width: "350px", maxWidth: "100%" }}>
          <Input
            etiqueta="Buscar orden"
            placeholder="Paciente, médico, diagnóstico..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>
          Mostrando {ordenesFiltradas.length} de {ordenes.length} órdenes
        </div>
      </div>

      {/* Grid de Tarjetas */}
      {cargando ? (
        <div style={{ backgroundColor: "#ffffff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#94a3b8" }}>
          Cargando órdenes médicas...
        </div>
      ) : ordenesFiltradas.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {ordenesFiltradas.map((orden) => (
            <div
              key={orden.id_orden}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "14px"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                    {orden.paciente || "Paciente N/A"}
                  </h3>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "#0369a1", backgroundColor: "#e0f2fe", padding: "2px 8px", borderRadius: "6px" }}>
                    {orden.estado || "Activa"}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: "#64748b", margin: "4px 0 0 0" }}>
                  Médico: <strong>{orden.medico || "N/A"}</strong>
                </p>
              </div>

              <div style={{ backgroundColor: "#f8fafc", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "12.5px", color: "#475569" }}>
                <div>
                  <span style={{ color: "#64748b" }}>Detalles / Diagnóstico: </span>
                  <span style={{ color: "#0f172a" }}>{orden.detalles || orden.diagnostico || "Sin detalles registrados"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "4px", borderTop: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b" }}>Fecha de creación:</span>
                  <span style={{ fontWeight: "600", color: "#0f172a" }}>{formatearFecha(orden.fecha_creacion || orden.fecha_orden)}</span>
                </div>

                {/* Selector para asignar enfermero visible para supervisión (Roles superiores / Enfermero Jefe) */}
                {!esMedico && (
                  <div style={{ paddingTop: "6px", borderTop: "1px solid #e2e8f0" }}>
                    <label style={{ display: "block", fontSize: "11.5px", fontWeight: "600", color: "#334155", marginBottom: "4px" }}>
                      Asignar a Enfermero(a):
                    </label>
                    <select
                      defaultValue={orden.id_enfermero || ""}
                      onChange={(e) => manejarAsignacion(orden.id_orden, e.target.value)}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12px", backgroundColor: "#fff" }}
                    >
                      <option value="">Seleccionar enfermero...</option>
                      {ENFERMEROS_DISPONIBLES.map((enf) => (
                        <option key={enf.id} value={enf.id}>{enf.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: "#ffffff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #cbd5e1", color: "#94a3b8" }}>
          {busqueda ? "Ninguna orden coincide con la búsqueda." : "No se encontraron órdenes médicas registradas."}
        </div>
      )}

      {/* Modal para la creación de la orden (Asegúrate de que tu OrdenForm no incluya el campo fecha_inicio) */}
      {modalAbierto && esMedico && (
        <OrdenForm
          onCerrar={() => setModalAbierto(false)}
          onGuardado={() => {
            setModalAbierto(false);
            cargarDatos();
            setMensajeExito("Orden médica registrada con éxito.");
            setTimeout(() => setMensajeExito(""), 4000);
          }}
        />
      )}
    </div>
  );
}