import pool from "../config/dbConnection";
import { IUsuario } from "../interfaces";

export default class Usuario {
    public static MAX_COOKIE_AGE: number = 1000 * 60 * 60 * 1; // 1 Hora
    
    public static async obtenerUsuarioPorId(id: number) {
        const QUERY = `SELECT usuarios.id, matricula, correo, carreras.nombre AS carrera, nombres, apellido_paterno, apellido_materno, roles.nombre AS rol 
        FROM usuarios LEFT JOIN carreras ON (usuarios.carrera_id = carreras.id) LEFT JOIN roles ON (usuarios.rol_id = roles.id) WHERE usuarios.id = '${id}';`;

        const res: Array<IUsuario> | undefined = await pool.query(QUERY);
        
        if( res === undefined || res.length == 0) {
            return undefined;
        }
        
        return res[0];
    }
    
    public static async obtenerUsuarioPorCorreo(correo: String): Promise<undefined | IUsuario> {
        const QUERY = `SELECT * FROM usuarios WHERE correo = '${correo}';`;
        const res: Array<IUsuario> | undefined = await pool.query(QUERY);
        
        if( res === undefined || res.length == 0) {
            return undefined;
        }
        
        return res[0];
    }
    
    public static async actualizarLoginCookie(id: number, cookie: string | undefined) {
        var QUERY = `UPDATE usuarios SET login_cookie = '${cookie}' WHERE id = '${id}'`
        
        if( cookie === undefined ) {
            QUERY = `UPDATE usuarios SET login_cookie = NULL WHERE id = '${id}'`
        }
        
        await pool.query(QUERY);
    }
    
    public static async comprobarCookie(id: number, cookie: string): Promise<boolean> {
        const QUERY = `SELECT login_cookie FROM usuarios WHERE id = '${id}'`;
        
        const results = await pool.query(QUERY);
        
        if(results === null || results.length === 0) {
            return false;
        }
        
        const fecha_creacion = new Date(results[0].login_cookie);
        const now = Date.now();
        
        /* Actualizar si la cookie ha caducado */
        if( ( now - fecha_creacion.getTime() ) > this.MAX_COOKIE_AGE )  {
            await this.actualizarLoginCookie(id, undefined);
            return false;
        }
        
        return results[0].login_cookie === cookie;
    }

    /**
     * Comprobar si una Id es de un revisor
     */
    public static async comprobarRevisor(id: number) {
        const QUERY = `SELECT roles.nombre AS rol FROM usuarios LEFT JOIN roles ON (usuarios.rol_id = roles.id) WHERE usuarios.id='${id}'`;
        const res: Array<IUsuario> = await pool.query(QUERY);
        
        if( res === undefined || res.length === 0 ) {
            return false;
        }
        
        return res[0].rol === "Revisor";
    }
}