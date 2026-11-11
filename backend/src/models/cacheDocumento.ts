import pool from "../config/dbConnection";
import { ICacheDocumento } from "../interfaces";

export default class CacheDocumento {
    public static async obtenerPorTramite(tramite_id: number): Promise<ICacheDocumento | undefined> {
        const QUERY = `SELECT tramite_id, nombre_archivo FROM cache_documentos WHERE tramite_id = ? LIMIT 1;`;
        const rows: Array<ICacheDocumento> = await pool.query(QUERY, [tramite_id]);

        if( rows.length === 0 ) {
            return undefined;
        }

        return rows[0];
    }

    public static async guardar(tramite_id: number, nombre_archivo: string) {
        // La tabla no tiene llave primaria: se reemplaza el registro anterior del trámite, si lo hay.
        await pool.query(`DELETE FROM cache_documentos WHERE tramite_id = ?;`, [tramite_id]);
        await pool.query(`INSERT INTO cache_documentos (tramite_id, nombre_archivo) VALUES (?, ?);`, [tramite_id, nombre_archivo]);
    }
}
