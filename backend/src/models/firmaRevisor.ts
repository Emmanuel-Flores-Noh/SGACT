import pool from "../config/dbConnection";
import { IFirmaRevisor } from "../interfaces";

export default class firma_revisor {
    public static async obtenerArchivoFirmaRevisor(peticion_id:number): Promise<string | undefined>{
        const QUERY = `SELECT firmas_revisores.nombre_archivo AS nombre_archivo
        FROM peticiones_tramite LEFT JOIN firmas_revisores ON ( firmas_revisores.id = peticiones_tramite.firma_id)
        WHERE peticiones_tramite.id = '${peticion_id}';`;
        
        const res:Array<IFirmaRevisor> = await pool.query(QUERY);
        
        if( res.length === 0 ) {
            return undefined;
        }

        return res[0].nombre_archivo;
    }
    
    public static async agregarFirma(revisor_id: number, nombre_archivo: string, preconfigurada: boolean) {
        const QUERY = `INSERT INTO firmas_revisores( revisor_id, nombre_archivo, preconfigurada  ) VALUES (${revisor_id}, '${nombre_archivo}', ${preconfigurada});`;
        
        const res: any = await pool.query(QUERY);
        
        return res;
    }
    
    public static async obtenerFirmasPreconfiguradas(revisor_id: number) {
        const QUERY = `SELECT * FROM firmas_revisores WHERE revisor_id = '${revisor_id}' AND preconfigurada = true;`

        const res:Array<IFirmaRevisor> = await pool.query(QUERY);
        
        return res;
    }
}