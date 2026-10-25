export type RolUsuario = 'alumno' | 'revisor' | 'admin' | string;

export interface IUsuario {
  id: number;
  matricula: string;
  correo: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  password: string;
  rol: RolUsuario;
  login_cookie?: string | null;
}
