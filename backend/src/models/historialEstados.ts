import pool from "../config/dbConnection";
import { IHistorialEstado } from "../interfaces";
export default class HistorialEstados {
    public static async obtenerHistorialAlumno(alumno_id: number): Promise<IHistorialEstado[]> {
        const QUERY = `
            SELECT he.* 
            FROM historial_estados he
            INNER JOIN peticiones_tramite pt ON he.peticion_id = pt.id
            WHERE pt.alumno_id = ? 
            ORDER BY he.fecha ASC;
        `;
        const rows = await pool.query(QUERY, [alumno_id]);
        return (rows as IHistorialEstado[]) || [];
    }
    public static async obtenerHistorialPeticion(peticion_id: number): Promise<IHistorialEstado[]> {
        const QUERY = `SELECT * FROM historial_estados WHERE peticion_id = ? ORDER BY fecha ASC;`;
        const rows = await pool.query(QUERY, [peticion_id]);
        return (rows as IHistorialEstado[]) || [];
    }
    public static async obtenerHistorialPeticiones(): Promise<IHistorialEstado[]> {
        const QUERY = `SELECT * FROM historial_estados ORDER BY fecha ASC;`;
        const rows = await pool.query(QUERY);
        return (rows as IHistorialEstado[]) || [];
    }
    public static async actualizarHistorialPeticion(estado_nuevo: string, peticion_id: number) {
        const fecha_cambio = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const QUERY = `INSERT INTO historial_estados (peticion_id, estado_nuevo, fecha) VALUES (?, ?, ?);`;
        await pool.query(QUERY, [peticion_id, estado_nuevo, fecha_cambio]);
    }
}