// Nombres EXACTOS de los roles, tal como están en la tabla "roles" de la base de datos.
export const ROLES = {
  ADMINISTRADOR: "Administrador",
  MEDICO: "Médico",
  ENFERMERO_JEFE: "Enfermero Jefe",
  ENFERMERO: "Enfermero",
  FARMACEUTICO: "Farmacéutico",
};

const { ADMINISTRADOR, MEDICO, ENFERMERO_JEFE, ENFERMERO, FARMACEUTICO } = ROLES;

/**
 * Módulos de la aplicación y qué roles pueden entrar a cada uno.
 * Con esta lista se arman a la vez el menú lateral y las rutas protegidas.
 */
export const MODULOS = [
  { ruta: "/usuarios", titulo: "Usuarios", roles: [ADMINISTRADOR] },
  { ruta: "/pacientes", titulo: "Pacientes", roles: [ADMINISTRADOR, MEDICO] },
  { ruta: "/medicamentos", titulo: "Medicamentos", roles: [ADMINISTRADOR, FARMACEUTICO] },
  { ruta: "/lotes", titulo: "Lotes", roles: [ADMINISTRADOR, FARMACEUTICO] },
  { ruta: "/ordenes", titulo: "Órdenes médicas", roles: [MEDICO, ENFERMERO_JEFE] },
  { ruta: "/aplicaciones", titulo: "Aplicaciones", roles: [ENFERMERO_JEFE, ENFERMERO] },
  { ruta: "/dispensaciones", titulo: "Dispensaciones", roles: [ENFERMERO_JEFE, FARMACEUTICO] },
  { ruta: "/auditoria", titulo: "Auditoría", roles: [ADMINISTRADOR] },
];

/** Elementos del menú lateral para un rol. */
export function menuParaRol(rol) {
  const secciones = MODULOS.filter((modulo) => modulo.roles.includes(rol)).map((modulo) => ({
    to: modulo.ruta,
    etiqueta: modulo.titulo,
  }));
  return [{ to: "/", etiqueta: "Inicio", end: true }, ...secciones];
}
