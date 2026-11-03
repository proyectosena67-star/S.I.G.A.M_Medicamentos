export interface UsuarioAutenticado {
  id_usuario: number;
  id_rol: number;
  rol: string;
  correo: string;
  nombres: string;
  apellidos: string;
}

export interface PayloadToken {
  id_usuario: number;
}
