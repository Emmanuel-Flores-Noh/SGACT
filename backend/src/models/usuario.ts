import pool from "../config/dbConnection";
import { IUsuario } from "../interfaces";

export default class Usuario {
    public static async obtenerUsuarioPorCorreo(correo: String): Promise<undefined | IUsuario> {
        const QUERY = `SELECT * FROM usuarios WHERE correo = '${correo}';`;
        const res: Array<IUsuario> | undefined = await pool.query(QUERY);
        
        if( res === undefined || res.length == 0) {
            return undefined;
        }
        
        return res[0];
    }
    
    public static async actualizarLoginCookie(id: number, cookie: string) {
        const QUERY = `UPDATE usuarios SET login_cookie = '${cookie}' WHERE id = '${id}'`
        
        await pool.query(QUERY);
    }
    
    public static async comprobarCookie(id: number, cookie: string): Promise<boolean> {
        const QUERY = `SELECT login_cookie FROM usuarios WHERE id = '${id}'`;
        
        const results = await pool.query(QUERY);
        
        if(results === null || results.length === 0) {
            return false;
        }
        
        return results[0].login_cookie === cookie;
    }
}