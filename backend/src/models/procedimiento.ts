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
}
