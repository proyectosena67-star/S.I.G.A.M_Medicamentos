export interface Paciente {
  id_paciente: number;
  tipo_documento: string;
  documento: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string | null;
  genero: string | null;
  telefono: string | null;
  correo: string | null;
  direccion: string | null;
  estado: boolean;
}
