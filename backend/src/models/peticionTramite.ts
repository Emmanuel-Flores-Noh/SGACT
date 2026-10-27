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
    public static async crearPeticionTramite(alumno_id:number, procedimiento_id: number): Promise<number> {
        const fecha_solicitud = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const QUERY = `INSERT INTO peticiones_tramite (alumno_id, procedimiento_id, estado, fecha_solicitud) VALUES (?, ?, ?, ?);`;
        const res = await pool.query(QUERY, [alumno_id, procedimiento_id, 'En confirmación de pago', fecha_solicitud]);
        return Number(res.insertId);
    }
    public static async crearPeticionConPago(
        alumno_id: number,
        procedimiento_id: number,
        metodo_pago: string,
        monto: number
    ): Promise<{ peticionId: number; pagoId: number }> {
        const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            const resPeticion = await conn.query(
                `INSERT INTO peticiones_tramite (alumno_id, procedimiento_id, estado, fecha_solicitud) VALUES (?, ?, ?, ?);`,
                [alumno_id, procedimiento_id, 'En confirmación de pago', fecha]
            );
            const peticionId = Number(resPeticion.insertId);

            const resPago = await conn.query(
                `INSERT INTO pagos (peticion_id, metodo_pago, monto, estado_pago, fecha) VALUES (?, ?, ?, ?, ?);`,
                [peticionId, metodo_pago, monto, 'pendiente', fecha]
            );
            const pagoId = Number(resPago.insertId);

            await conn.query(
                `INSERT INTO historial_estados (peticion_id, estado_anterior, estado_nuevo, fecha) VALUES (?, ?, ?, ?);`,
                [peticionId, 'Inicio', 'En confirmación de pago', fecha]
            );

            await conn.commit();
            return { peticionId, pagoId };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
    public static async actualizarEstadoPeticion(peticion_id:number, estado_nuevo:EstadoPeticion){
        // Añadir al historial de cambios
        await HistorialEstados.actualizarHistorialPeticion(estado_nuevo, peticion_id);
        const QUERY = `UPDATE peticiones_tramite SET estado = ? WHERE id = ?;`;
        await pool.query(QUERY, [estado_nuevo, peticion_id]);
    }

}
