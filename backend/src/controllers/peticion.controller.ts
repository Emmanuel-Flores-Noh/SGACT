import { Request, Response } from "express";
import PeticionTramite from "../models/peticionTramite";
import StatusCodes from "http-status-codes";

const ROL_REVISOR = "revisor";


async function obtenerPeticiones(req:Request, res:Response) {
    if (!req.session.rol) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    try {
        if (req.session.rol.toLowerCase() === ROL_REVISOR) {
            // El revisor ve todas las peticiones en trámite
            const peticiones = await PeticionTramite.obtenerPeticionesEnTramite();
            return res.status(StatusCodes.OK).json(peticiones);
        } else {
            // El alumno solo ve sus propias peticiones
            const alumno_id = Number(req.session.usuarioId);
            if (isNaN(alumno_id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parametros: ID de alumno inválido en sesión" });
            }
            const peticiones = await PeticionTramite.obtenerPeticionesPorAlumno(alumno_id);
            return res.status(StatusCodes.OK).json(peticiones);
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: No se pudieron obtener las peticiones" });
    }
    
}

async function crearPeticion(req:Request, res:Response) {
    if (!req.session.rol || !req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    let alumno_id: number;
    const { procedimiento_id } = req.body;

    if (!procedimiento_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parametros: Falta el procedimiento_id" });
    }
    // Si es revisor, puede usar id de alumno
    if (req.session.rol.toLowerCase() === ROL_REVISOR) {
        
        if (!req.body.alumno_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parametros: El revisor debe especificar el alumno_id" });
        }
        alumno_id = Number(req.body.alumno_id);
    } // Si es alumno, es su propia id
    else {
        alumno_id = Number(req.session.usuarioId);
    }

    if (isNaN(alumno_id) || alumno_id <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parametros: ID de alumno invalido o vacío" });
    }
    try {
        await PeticionTramite.crearPeticionTramite(alumno_id, procedimiento_id);
        return res.status(StatusCodes.CREATED).json({ mensaje: "Proceso exitoso: Trámite de petición completado con éxito" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: Error al crear trámite de petición" });
    }
}

async function actualizarPeticion(req:Request, res:Response) {
    if (!req.session.rol || req.session.rol.toLowerCase() !== ROL_REVISOR) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: Usted no tiene autorización para realizar cambios" });
    }

    const { peticion_id, estado_nuevo } = req.body;

    if (!peticion_id || !estado_nuevo) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parametros: Algunos parámetros están vacíos" });
    }

    try {
        await PeticionTramite.actualizarEstadoPeticion(Number(peticion_id), estado_nuevo);
        return res.status(StatusCodes.OK).json({ mensaje: "Proceso exitoso: Trámite de petición actualizado con éxito" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: Error al actualizar trámite de petición" });
    }
}
async function obtenerPeticionID(req: Request, res: Response) {
    if (!req.session.rol || !req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    const peticion_id = Number(req.params.id || req.query.id || req.body.peticion_id);
    if (isNaN(peticion_id)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parametros: ID de petición inválido o vacío" });
    }

    try {
        const peticion = await PeticionTramite.obtenerPeticionPorId(peticion_id);
        if (!peticion) {
            return res.status(StatusCodes.NOT_FOUND).json({ mensaje: "Proceso fallido: Petición no encontrada" });
        }

        // Si es alumno, verificar que la petición le pertenezca estrictamente
        if (req.session.rol.toLowerCase() !== ROL_REVISOR) {
            if (Number(peticion.alumno_id) !== Number(req.session.usuarioId)) {
                return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No puedes ver peticiones de otros alumnos" });
            }
        }

        return res.status(StatusCodes.OK).json(peticion);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: Error al obtener el detalle de la petición" });
    }
}
export{
    obtenerPeticiones,
    crearPeticion,
    actualizarPeticion,
    obtenerPeticionID
}