import { Request, Response } from "express";
import PeticionTramite from "../models/peticionTramite";
import Usuario from "../models/usuario"; 
import StatusCodes from "http-status-codes";

async function obtenerPeticiones(req: Request, res: Response) {
    if (!req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    try {
        const esRevisor = await Usuario.comprobarRevisor(Number(req.session.usuarioId));

        if (esRevisor) {
            const peticiones = await PeticionTramite.obtenerPeticionesEnTramite();
            return res.status(StatusCodes.OK).json(peticiones);
        } else {
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

async function crearPeticion(req: Request, res: Response) {
    if (!req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    let alumno_id: number;
    const { procedimiento_id } = req.body;

    if (!procedimiento_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parametros: Falta el procedimiento_id" });
    }

    const esRevisor = await Usuario.comprobarRevisor(Number(req.session.usuarioId));
    if (esRevisor) {
        if (!req.body.alumno_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parametros: El revisor debe especificar el alumno_id" });
        }
        alumno_id = Number(req.body.alumno_id);
    } 
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

async function actualizarPeticion(req: Request, res: Response) {
    if (!req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    const esRevisor = await Usuario.comprobarRevisor(Number(req.session.usuarioId));
    if (!esRevisor) {
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
    if (!req.session.usuarioId) {
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

        const esRevisor = await Usuario.comprobarRevisor(Number(req.session.usuarioId));
        if (!esRevisor) {
            if (Number(peticion.alumno_id) !== Number(req.session.usuarioId)) {
                return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No puedes ver peticiones de otros alumnos" });
            }
        }

        return res.status(StatusCodes.OK).json(peticion);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: Error al obtener el detalle de la petición" });
    }
}

export {
    obtenerPeticiones,
    crearPeticion,
    actualizarPeticion,
    obtenerPeticionID
};