import { Request, Response } from "express";
import PeticionTramite from "../models/peticionTramite";

async function obtenerPeticionAlumno(req:Request, res:Response) {
    const alumno_id = Number(req.params.alumno_id);
    if (isNaN(alumno_id)) return res.status(400).json({mensaje: "Id de alumno vacia"});
    try {
        const peticiones = await PeticionTramite.obtenerPeticionesPorAlumno(alumno_id);
        res.json(peticiones)
    } catch (error) {
        res.status(500).json({mensaje: "No se pudo obtener las peticiones del alumno"});
    }
    
}
async function obtenerPeticionesTramites(req:Request, res:Response) {
    try {
        const peticiones = await PeticionTramite.obtenerPeticionesTotales();
        res.json(peticiones);
    } catch (error) {
        res.status(500).json({mensaje: "No se pudo obtener las peticiones del alumno"});
    }
}
async function crearPeticionTramite(req:Request, res:Response) {
    const {alumno_id, procedimiento_id } = req.body;
    if (!alumno_id || !procedimiento_id) return res.status(400).json({mensaje: "Campos incompletos"});
    try {
        await PeticionTramite.crearPeticionTramite(alumno_id, procedimiento_id);
        res.status(201).json({mensaje: "Tramite de peticion completado con exito"});
    } catch (error) {
        res.status(500).json({mensaje: "Error al crear tramite de peticion"});
    }
}
async function actualizarEstadoPeticion(req:Request, res:Response) {
    const peticion_id = Number(req.params.id);
    const estado_nuevo = req.body;
    if (isNaN(peticion_id) || !estado_nuevo) return res.status(400).json({mensaje: "Algunso parametros estan vacios"});
    try {
        await PeticionTramite.actualizarEstadoPeticion(peticion_id,estado_nuevo);
        res.status(201).json({mensaje: "Tramite de peticion actualizado con exito"});

    } catch (error) {
        res.status(500).json({mensaje: "Error al actualizar tramite de peticion"});
    }

    
}
export{
    obtenerPeticionAlumno,
    obtenerPeticionesTramites,
    crearPeticionTramite,
    actualizarEstadoPeticion,
}