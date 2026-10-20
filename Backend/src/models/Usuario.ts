export interface Usuario {
  id_usuario: number;
  id_rol: number;
  tipo_documento: string;
  documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  password_hash: string;
  telefono: string | null;
  especialidad: string | null;
  estado: boolean;
  fecha_creacion: Date;
}

// Usuario sin el hash, con el nombre de su rol: es lo único que sale hacia el cliente
export type UsuarioPublico = Omit<Usuario, 'password_hash'> & { rol: string };

export interface UsuarioLogin extends Usuario {
  rol: string;
  rol_estado: boolean;
}

export interface UsuarioAuth {
  id_usuario: number;
  correo: string;
  estado: boolean;
  rol: string;
  rol_estado: boolean;
}
