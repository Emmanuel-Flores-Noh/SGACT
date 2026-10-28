export type RolUsuario = 'Alumno' | 'Revisor' | string;

export interface IUsuario {
  id: number;
  matricula: string | undefined;
  correo: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  password: string;
  rol: RolUsuario;
  carrera: string | undefined;
  login_cookie?: string | null;
}
