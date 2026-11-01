export interface Paciente {
  id_paciente: number;
  tipo_documento: string;
  documento: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  genero: string;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  estado: boolean;
}
