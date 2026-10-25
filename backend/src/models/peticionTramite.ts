import pool from "../config/dbConnection";
import { EstadoPeticion, IPeticionTramite } from "../interfaces";
import HistorialEstados from "./historialEstados";
export default class PeticionTramite {
    public static async obtenerPeticionesPorAlumno(alumno_id:number): Promise<IPeticionTramite[]> {
        const QUERY = `Select alumno_id, procedimiento_id, estado, fecha_solicitud from peticiones_tramite where alumno_id = '${alumno_id}';`;
        const res = await pool.query(QUERY);
        return res || [];
    }
    public static async obtenerPeticionesTotales(): Promise<IPeticionTramite[]> {
        const QUERY = `SELECT id, alumno_id, procedimiento_id, estado, fecha_solicitud FROM peticiones_tramite;`;
        const res = await pool.query(QUERY);
        return res || [];
    }
    public static async crearPeticionTramite(alumno_id:number, procedimiento_id: number){
        const fecha_solicitud = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const QUERY = `INSERT INTO peticiones_tramite (alumno_id, procedimiento_id, estado, fecha_solicitud) VALUES ('${alumno_id}','${procedimiento_id}','En confirmación de pago', '${fecha_solicitud}'):`;
        await pool.query(QUERY);
    }
    public static async actualizarEstadoPeticion(peticion_id:number, estado_nuevo:EstadoPeticion){
        // Añadir al historial de cambios
        HistorialEstados.actualizarHistorialPeticion(estado_nuevo, peticion_id);
        const QUERY = `UPDATE peticiones_tramite SET estado = '${estado_nuevo}' where peticion_id = '${peticion_id}';`;
        await pool.query(QUERY);
    }

}