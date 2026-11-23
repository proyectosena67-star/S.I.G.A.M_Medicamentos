import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { menuParaRol } from "../utils/modulos";
import { 
  Users, 
  UserCheck, 
  Pill, 
  Package, 
  FileText, 
  Syringe, 
  Receipt, 
  ShieldCheck, 
  LayoutDashboard,
  Calendar,
  Clock,
  AlertTriangle,
  Activity
} from "lucide-react";

// Iconos y descripciones profesionales para cada ruta de acceso rápido
const INFO_MODULOS = {
  "/usuarios": { 
    icono: <Users size={24} color="#1d4ed8" />, 
    desc: "Gestión de personal, cuentas de acceso y roles del sistema." 
  },
  "/pacientes": { 
    icono: <UserCheck size={24} color="#0f766e" />, 
    desc: "Registro, historias y control de datos de pacientes." 
  },
  "/medicamentos": { 
    icono: <Pill size={24} color="#0369a1" />, 
    desc: "Catálogo general de fármacos y códigos CUMS." 
  },
  "/lotes": { 
    icono: <Package size={24} color="#b45309" />, 
    desc: "Control de inventario, stock y fechas de vencimiento." 
  },
  "/ordenes": { 
    icono: <FileText size={24} color="#047857" />, 
    desc: "Creación y seguimiento de prescripciones médicas." 
  },
  "/aplicaciones": { 
    icono: <Syringe size={24} color="#be123c" />, 
    desc: "Registro y control horario de administración de dosis." 
  },
  "/dispensaciones": { 
    icono: <Receipt size={24} color="#6d28d9" />, 
    desc: "Entrega y despacho de medicamentos por orden." 
  },
  "/auditoria": { 
    icono: <ShieldCheck size={24} color="#4338ca" />, 
    desc: "Historial de movimientos, accesos y seguridad del sistema." 
  },
};

export default function DashboardPage() {
  const { usuario } = useAuth();
  const [fechaActual, setFechaActual] = useState(new Date());

  // Reloj en tiempo real para la cabecera clínica
  useEffect(() => {
    const timer = setInterval(() => setFechaActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Extraemos los accesos permitidos para el rol actual (excluyendo el inicio "/")
  const rolActual = usuario?.rol || "Usuario";
  const accesos = menuParaRol(rolActual).filter((elemento) => elemento.to !== "/");

  // Definir métricas (KPIs) simuladas según el rol del usuario
  const obtenerKpis = () => {
    if (rolActual === "Administrador" || rolActual === "Farmacéutico") {
      return [
        { titulo: "Stock Crítico", valor: "3", icono: <AlertTriangle size={22} color="#dc2626" />, bg: "#ffeeef" },
        { titulo: "Usuarios Activos", valor: "24", icono: <Users size={22} color="#2563eb" />, bg: "#eff6ff" },
        { titulo: "Lotes por Vencer", valor: "5", icono: <Package size={22} color="#d97706" />, bg: "#fef3c7" },
      ];
    }
    if (rolActual === "Médico") {
      return [
        { titulo: "Mis Órdenes Generadas", valor: "5", icono: <FileText size={22} color="#059669" />, bg: "#ecfdf5" },
        { titulo: "Mis Pacientes Asignados", valor: "4", icono: <UserCheck size={22} color="#0d9488" />, bg: "#f0fdfa" },
      ];
    }
    // Para Enfermero u otros roles
    return [
      { titulo: "Pendientes del Día", valor: "6", icono: <Clock size={22} color="#2563eb" />, bg: "#eff6ff" },
      { titulo: "Administradas", valor: "14", icono: <Syringe size={22} color="#059669" />, bg: "#ecfdf5" },
    ];
  };

  const kpis = obtenerKpis();

  return (
    <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* 1. CABECERA DE BIENVENIDA DINÁMICA */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)",
          color: "white",
          padding: "32px",
          borderRadius: "12px",
          marginBottom: "28px",
          boxShadow: "0 4px 15px rgba(30, 64, 175, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <LayoutDashboard size={18} />
            <span style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "3px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>
              {rolActual}
            </span>
          </div>
          <h1 style={{ fontSize: "1.9rem", margin: "0 0 6px 0" }}>
            ¡Bienvenido de nuevo, {usuario?.nombres || "Usuario"}!
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: "0.95rem" }}>
            Sistema Integral de Gestión y Administración Médica - Panel Principal
          </p>
        </div>

        {/* Fecha y Hora en tiempo real */}
        <div style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.12)", 
          padding: "12px 18px", 
          borderRadius: "10px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "4px",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", opacity: 0.9 }}>
            <Calendar size={14} />
            {fechaActual.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "1.1rem", fontWeight: "bold" }}>
            <Clock size={16} />
            {fechaActual.toLocaleTimeString("es-ES")}
          </div>
        </div>
      </div>

      {/* 2. TARJETAS DE MÉTRICAS RÁPIDAS (KPIs) */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`, 
          gap: "16px", 
          marginBottom: "32px" 
        }}
      >
        {kpis.map((kpi, index) => (
          <div 
            key={index}
            style={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
            }}
          >
            <div>
              <p style={{ margin: "0 0 6px 0", color: "#64748b", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase" }}>
                {kpi.titulo}
              </p>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.8rem", fontWeight: "bold" }}>
                {kpi.valor}
              </h3>
            </div>
            <div style={{ width: "45px", height: "45px", borderRadius: "10px", backgroundColor: kpi.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {kpi.icono}
            </div>
          </div>
        ))}
      </div>

      {/* 3. ACCESOS DIRECTOS VISUALES (CARDS) */}
      <h2 style={{ fontSize: "1.15rem", color: "#1e293b", marginBottom: "16px" }}>
        Módulos del Sistema
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "36px"
        }}
      >
        {accesos.map((acceso) => {
          const info = INFO_MODULOS[acceso.to] || { 
            icono: <FileText size={24} color="#475569" />, 
            desc: "Acceso al módulo del sistema." 
          };

          return (
            <Link
              key={acceso.to}
              to={acceso.to}
              style={{
                textDecoration: "none",
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#93c5fd";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "#e2e8f0";
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  backgroundColor: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {info.icono}
              </div>
              <h3 style={{ margin: 0, color: "#1e293b", fontSize: "1.2rem", fontWeight: "600" }}>
                {acceso.etiqueta}
              </h3>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem", lineHeight: "1.4" }}>
                {info.desc}
              </p>
            </Link>
          );
        })}
      </div>

      {/* 4. SECCIÓN DE ACTIVIDAD RECIENTE O ALERTAS */}
      <div 
        style={{
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Activity size={20} color="#1d4ed8" />
          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#1e293b" }}>
            Actividad Reciente del Sistema
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#f8fafc", borderRadius: "8px", fontSize: "0.9rem", color: "#334155" }}>
            <span>Inicio de sesión exitoso ({rolActual})</span>
            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Hace unos minutos</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", backgroundColor: "#f8fafc", borderRadius: "8px", fontSize: "0.9rem", color: "#334155" }}>
            <span>Verificación de módulos autorizados cargada correctamente</span>
            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Hoy</span>
          </div>
        </div>
      </div>

    </div>
  );
}