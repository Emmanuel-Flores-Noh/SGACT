import pool from "../config/dbConnection";
import { EstadoPago, IPago } from "../interfaces";

export default class Pago {
    public static async crearPago(
        peticion_id: number,
        metodo_pago: string,
        monto: number,
        estado_pago: EstadoPago = 'pendiente'
    ): Promise<number> {
        const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const QUERY = `INSERT INTO pagos (peticion_id, metodo_pago, monto, estado_pago, fecha) VALUES (?, ?, ?, ?, ?);`;
        const res = await pool.query(QUERY, [peticion_id, metodo_pago, monto, estado_pago, fecha]);
        return Number(res.insertId);
    }

    public static async obtenerPagosPorPeticion(peticion_id: number): Promise<IPago[]> {
        const QUERY = `SELECT * FROM pagos WHERE peticion_id = ? ORDER BY fecha;`;
        const res: Array<IPago> | undefined = await pool.query(QUERY, [peticion_id]);
        return res ? Array.from(res) : [];
    }
}
