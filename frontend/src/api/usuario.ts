import { POST, GET } from "./apiConnection";

export interface Usuario {
    id: number,
    // Si es revisor no tiene matricula
    matricula: string | undefined,
    carrera: string | undefined,
    correo: string,
    nombres: string,
    apellido_paterno: string,
    apellido_materno: string,
    rol: "Alumno" | "Revisor",
};


/**
 * Se encarga de colocar la cookie en el navegador para autentificar el usuario
 * @returns Si se ha logeado con exito o no.
 */
export async function login(correo: string, password: string): Promise<boolean> {
    const res = await POST('/api/auth/login', {'correo': correo, 'password': password});
    
    return res.ok;
}

/**
 * Se encarga de deslogear el usuario
 * @returns Si se ha deslogeado con exito
 */
export async function logout() {
    const res = await GET('/api/auth/logout')
    
    return res.ok;
}

/**
 * Obtener informacion del usuario logeado
 */
export async function getUserData() {
    const res = await GET('/api/usuario');
    
    return res;
}