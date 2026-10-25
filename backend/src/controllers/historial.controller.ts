import { Request, Response } from "express";
import HistorialEstados from "../models/historialEstados";

async function obtenerHistorialPeticion(req:Request, res:Response) {
    const peticion_id = Number(req.params.peticion_id);
    if (isNaN(peticion_id)) return res.status(400).json({mensaje: "Id de peticion vacia"});
    try {
        const historial = await HistorialEstados.obtenerHistorialPeticion(peticion_id);
        res.status(200).json(historial);
    } catch (error) {
        res.status(500).json({mensaje: "No se pudo obtener las peticiones del alumno"});
    }
}
export{
    obtenerHistorialPeticion,
}