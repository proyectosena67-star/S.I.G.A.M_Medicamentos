/** Usuario tal como se expone en la API (nunca incluye el hash de la contraseña). */
export interface Usuario {
  id_usuario: number;
  id_rol: number;
  rol?: string;
  tipo_documento: string;
  documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string | null;
  especialidad: string | null;
  estado: boolean;
  fecha_creacion: Date;
}

/** Solo se usa internamente en el login. */
export interface UsuarioConPassword extends Usuario {
  password_hash: string;
}
