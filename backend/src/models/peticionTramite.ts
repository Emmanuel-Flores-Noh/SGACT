import pool from "../config/dbConnection";
import { EstadoPeticion, IPeticionTramite } from "../interfaces";
import HistorialEstados from "./historialEstados";
export default class PeticionTramite {
    public static async obtenerPeticionesPorAlumno(alumno_id:number): Promise<IPeticionTramite[]> {
        const QUERY = `SELECT alumno_id, procedimiento_id, estado, fecha_solicitud FROM peticiones_tramite WHERE alumno_id = ?;`;
        const rows = await pool.query(QUERY, [alumno_id]);
        return (rows as IPeticionTramite[]) || [];
    }
    public static async obtenerPeticionesTramitePorAlumno(alumno_id:number): Promise<IPeticionTramite[]> {
        const QUERY = `SELECT alumno_id, procedimiento_id, estado, fecha_solicitud FROM peticiones_tramite WHERE alumno_id = ? AND estado = 'En trámite';`;
        const rows = await pool.query(QUERY, [alumno_id]);
        return (rows as IPeticionTramite[]) || [];
    }
    public static async obtenerPeticionesTotales(): Promise<IPeticionTramite[]> {
        const QUERY = `
            SELECT 
                pt.id AS peticion_id,
                pt.estado,
                pt.fecha_solicitud,
                u.id AS alumno_id,
                u.matricula,
                u.nombres,
                u.apellido_paterno,
                u.apellido_materno,
                p.nombre AS nombre_tramite
            FROM peticiones_tramite pt
            INNER JOIN usuarios u ON pt.alumno_id = u.id
            INNER JOIN procedimientos p ON pt.procedimiento_id = p.id
            INNER JOIN pagos pg ON pg.peticion_id = pt.id
            WHERE pt.estado = 'En trámite' AND pg.estado_pago = 'Confirmado'
            ORDER BY pt.fecha_solicitud ASC;
        `;
        const rows = await pool.query(QUERY);
        return (rows as IPeticionTramite[]) || [];
    }
    public static async obtenerPeticionesEnTramite(): Promise<IPeticionTramite[]> {
        const QUERY = `SELECT id, alumno_id, procedimiento_id, estado, fecha_solicitud FROM peticiones_tramite where estado = 'en tramite';`;
        const rows = await pool.query(QUERY);
        return (rows as IPeticionTramite[]) || [];
    }
    public static async crearPeticionTramite(alumno_id:number, procedimiento_id: number){
        const fecha_solicitud = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const QUERY = `INSERT INTO peticiones_tramite (alumno_id, procedimiento_id, estado, fecha_solicitud) VALUES (?, ?, 'En confirmación de pago', ?);`;
        await pool.query(QUERY, [alumno_id, procedimiento_id, fecha_solicitud]);
    }
    public static async actualizarEstadoPeticion(peticion_id:number, estado_nuevo:EstadoPeticion){
        // Añadir al historial de cambios
        HistorialEstados.actualizarHistorialPeticion(estado_nuevo, peticion_id);
        const QUERY = `UPDATE peticiones_tramite SET estado = ? WHERE id = ?;`;
        await pool.query(QUERY, [estado_nuevo, peticion_id]);
    }
    public static async obtenerPeticionPorId(peticion_id: number): Promise<IPeticionTramite | null> {
        const QUERY = `
            SELECT 
                pt.id AS peticion_id,
                pt.estado,
                pt.fecha_solicitud,
                u.id AS alumno_id,
                u.matricula,
                u.nombres,
                u.apellido_paterno,
                u.apellido_materno,
                p.nombre AS nombre_tramite,
                p.descripcion AS descripcion_tramite
            FROM peticiones_tramite pt
            INNER JOIN usuarios u ON pt.alumno_id = u.id
            INNER JOIN procedimientos p ON pt.procedimiento_id = p.id
            WHERE pt.id = ?;
        `;
        const rows: any = await pool.query(QUERY, [peticion_id]);
        if (rows && rows.length > 0) {
            return rows[0] as IPeticionTramite;
        }
        return null;
    }

}