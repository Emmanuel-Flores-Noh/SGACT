import pool from "../config/dbConnection";
import { IProcedimiento } from "../interfaces";

export default class Procedimiento {
    public static async obtenerTodos(): Promise<Array<IProcedimiento>> {
        const QUERY = `SELECT id, nombre, descripcion, costo, vigencia_meses FROM procedimientos ORDER BY nombre;`;
        const res: Array<IProcedimiento> | undefined = await pool.query(QUERY);

        if (res === undefined) {
            return [];
        }

        return res;
    }

    public static async obtenerPorId(id: number): Promise<IProcedimiento | undefined> {
        const QUERY = `SELECT * FROM procedimientos WHERE id = ?;`;
        const res: Array<IProcedimiento> | undefined = await pool.query(QUERY, [id]);

        if (res === undefined || res.length === 0) {
            return undefined;
        }

        return res[0];
    }
}
