export type RolUsuario = 'Alumno' | 'Revisor' | string;

export interface IUsuario {
  id: number;
  matricula?: string | null;
  correo: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  password: string;
  rol_id?: number | null;
  carrera_id?: number | null;
  rol?: RolUsuario;
  carrera?: string | null;
  login_cookie?: string | null;
}

