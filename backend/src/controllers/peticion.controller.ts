import { Request, Response } from "express";
import PeticionTramite from "../models/peticionTramite";
import StatusCodes from "http-status-codes";

const ROL_ADMITIDO = "revisor";
async function obtenerPeticionAlumno(req:Request, res:Response) {
    
    const alumno_id = Number(req.params.alumno_id);
    if (isNaN(alumno_id) || alumno_id < 0) return res.status(StatusCodes.BAD_REQUEST).json({mensaje: "Id de alumno vacia"});
    try {
        const peticiones = await PeticionTramite.obtenerPeticionesPorAlumno(alumno_id);
        res.json(peticiones)
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({mensaje: "No se pudo obtener las peticiones del alumno"});
    }
    
}
async function obtenerPeticionesTramites(req:Request, res:Response) {
    // Validar acceso
    if (!req.session.rol || req.session.rol.toLowerCase() !== ROL_ADMITIDO) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: Se requiere rol de Revisor" });
    }
    try {
        const peticiones = await PeticionTramite.obtenerPeticionesTotales();
        res.status(StatusCodes.OK).json(peticiones);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "No se pudieron obtener las peticiones en trámite" });
    }
}
async function crearPeticionTramite(req:Request, res:Response) {
    const {alumno_id, procedimiento_id } = req.body;
    if (!alumno_id || !procedimiento_id) return res.status(StatusCodes.BAD_REQUEST).json({mensaje: "Campos incompletos"});
    try {
        await PeticionTramite.crearPeticionTramite(alumno_id, procedimiento_id);
        res.status(StatusCodes.OK).json({mensaje: "Tramite de peticion completado con exito"});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({mensaje: "Error al crear tramite de peticion"});
    }
}
async function actualizarEstadoPeticion(req:Request, res:Response) {
    const peticion_id = Number(req.params.id);
    const { estado_nuevo } = req.body;
    if (isNaN(peticion_id) || !estado_nuevo) return res.status(StatusCodes.BAD_REQUEST).json({mensaje: "Algunso parametros estan vacios"});
    try {
        await PeticionTramite.actualizarEstadoPeticion(peticion_id,estado_nuevo);
        res.status(StatusCodes.OK).json({mensaje: "Tramite de peticion actualizado con exito"});

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({mensaje: "Error al actualizar tramite de peticion"});
    }

    
}
async function obtenerDetallePeticionRevisor(req: Request, res: Response) {
    if (!req.session.rol || req.session.rol.toLowerCase() !== "revisor") {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: Se requiere rol de Revisor" });
    }

    const peticion_id = Number(req.params.id);
    if (isNaN(peticion_id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Faltan parametros: No se encontro el parametro" });
    }

    try {
        const peticion = await PeticionTramite.obtenerPeticionPorId(peticion_id);
        if (!peticion) {
            return res.status(StatusCodes.NOT_FOUND).json({ mensaje: "Petición no encontrada" });
        }
        res.status(200).json(peticion);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Error al obtener el detalle de la petición" });
    }
}
export{
    obtenerPeticionAlumno,
    obtenerPeticionesTramites,
    crearPeticionTramite,
    actualizarEstadoPeticion,
    obtenerDetallePeticionRevisor
}