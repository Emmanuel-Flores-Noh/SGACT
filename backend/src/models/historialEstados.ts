import pool from "../config/dbConnection";
import { IHistorialEstado } from "../interfaces";
export default class HistorialEstados {
    public static async obtenerHistorialPeticion(peticion_id: number): Promise<IHistorialEstado[]> {
        const QUERY = `SELECT * FROM historial_estados WHERE peticion_id = ? ORDER BY fecha ASC;`;
        const [rows] = await pool.query(QUERY, [peticion_id]);
        return (rows as IHistorialEstado[]) || [];
    }
    public static async actualizarHistorialPeticion(estado_nuevo:String, peticion_id: number){
        const QUERY = `SELECT estado_nuevo FROM historial_estados WHERE peticion_id = ? ORDER BY id DESC LIMIT 1;`;
        const [rows]: any = await pool.query(QUERY, [peticion_id]);
        
        if (rows && rows.length > 0) {
            return rows[0].estado_nuevo;
        }
        return 'En confirmación de pago';
    }
}