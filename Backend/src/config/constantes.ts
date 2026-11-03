export const ROLES = {
  ADMINISTRADOR: "Administrador",
  MEDICO: "Médico",
  ENFERMERO_JEFE: "Enfermero Jefe",
  ENFERMERO: "Enfermero",
  FARMACEUTICO: "Farmacéutico",
} as const;

export type NombreRol = (typeof ROLES)[keyof typeof ROLES];

export const TIPOS_DOCUMENTO = ["CC", "TI", "CE", "PA", "RC", "PEP"] as const;
export const GENEROS = ["M", "F", "O"] as const;

export const ESTADOS_ORDEN = ["activa", "finalizada", "cancelada"] as const;
export const ESTADOS_APLICACION = ["pendiente", "administrada", "omitida"] as const;

export type EstadoOrden = (typeof ESTADOS_ORDEN)[number];
export type EstadoAplicacion = (typeof ESTADOS_APLICACION)[number];
