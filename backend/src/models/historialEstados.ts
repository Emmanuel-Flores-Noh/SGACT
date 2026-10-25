import pool from "../config/dbConnection";
import { IHistorialEstado } from "../interfaces";
export default class HistorialEstados {
    public static async obtenerHistorialPeticion(peticion_id: number): Promise<undefined | IHistorialEstado> {
        const QUERY = `SELECT * FROM historial_estados WHERE peticion_id = '${peticion_id}';`;
        const res: Array<IHistorialEstado> | undefined = await pool.query(QUERY);
        
        if( res === undefined || res.length == 0) {
            return undefined;
        }
        
        return res[0];
    }
    public static async actualizarHistorialPeticion(estado_nuevo:String, peticion_id: number){
        const ultimoHistorial = await this.obtenerHistorialPeticion(peticion_id);
        const estado_anterior = ultimoHistorial ? ultimoHistorial.estado_nuevo : 'Inicio';
        const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const QUERY = `INSERT INTO historial_estados (peticion_id, estado_anterior, estado_nuevo, fecha) VALUES ('${peticion_id}','${estado_anterior}','${estado_nuevo}', '${fecha}' );`;
        await pool.query(QUERY);
    }


}