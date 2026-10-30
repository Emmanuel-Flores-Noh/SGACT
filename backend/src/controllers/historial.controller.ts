import { Request, Response } from "express";
import HistorialEstados from "../models/historialEstados";
import PeticionTramite from "../models/peticionTramite";
import StatusCodes from "http-status-codes";
import Usuario from "../models/usuario";

async function obtenerHistorialPeticion(req: Request, res: Response) {
    if (!req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    const peticion_id = Number(req.params.peticion_id);
    if (isNaN(peticion_id) || peticion_id <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parámetros: ID de petición inválido o vacío" });
    }

    try {
        const peticion = await PeticionTramite.obtenerPeticionPorId(peticion_id);
        if (!peticion) {
            return res.status(StatusCodes.NOT_FOUND).json({ mensaje: "Proceso fallido: Petición no encontrada" });
        }

        const esRevisor = await Usuario.comprobarRevisor(Number(req.session.usuarioId));

        if (!esRevisor) {
            if (Number(peticion.alumno_id) !== Number(req.session.usuarioId)) {
                return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No puedes ver el historial de peticiones de otros alumnos" });
            }
        }

        const historial = await HistorialEstados.obtenerHistorialPeticion(peticion_id);
        return res.status(StatusCodes.OK).json(historial);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: No se pudo obtener el historial de la petición" });
    }
}

async function obtenerHistorialPorAlumno(req: Request, res: Response) {
    if (!req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }
    
    let alumno_id: number;
    const esRevisor = await Usuario.comprobarRevisor(Number(req.session.usuarioId));

    if (esRevisor) {
        // Si es revisor, puede especificar a qué alumno quiere consultar por parámetro
        const alumnoParam = req.params.alumno_id || req.query.alumno_id;
        if (!alumnoParam) {
            return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parámetros: El revisor debe especificar el alumno_id" });
        }
        alumno_id = Number(alumnoParam);
    } else {
        // Si es alumno, solo puede ver su propio historial
        alumno_id = Number(req.session.usuarioId);
    }

    if (isNaN(alumno_id) || alumno_id <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parámetros: ID de alumno inválido" });
    }

    try {
        const historial = await HistorialEstados.obtenerHistorialAlumno(alumno_id);
        return res.status(StatusCodes.OK).json(historial);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: No se pudo obtener el historial del alumno" });
    }
}

async function obtenerHistorialPeticiones(req: Request, res: Response) {
    if (!req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    const esRevisor = await Usuario.comprobarRevisor(Number(req.session.usuarioId));
    if (!esRevisor) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: Se requiere rol de Revisor" });
    }

    try {
        const historialGlobal = await HistorialEstados.obtenerHistorialPeticiones();
        console.log("TOTAL DE HISTORIALES OBTENIDOS:", historialGlobal.length);
        return res.status(StatusCodes.OK).json(historialGlobal);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: No se pudo obtener el historial general" });
    }
}

async function registrarHistorialPeticion(req: Request, res: Response) {
    if (!req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    const esRevisor = await Usuario.comprobarRevisor(Number(req.session.usuarioId));
    if (!esRevisor) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: Usted no tiene autorización para realizar esta acción" });
    }

    const { peticion_id, estado_nuevo } = req.body;

    if (!peticion_id || !estado_nuevo) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parámetros: Faltan datos (peticion_id o estado_nuevo)" });
    }

    try {
        await HistorialEstados.actualizarHistorialPeticion(estado_nuevo, Number(peticion_id));
        return res.status(StatusCodes.CREATED).json({ mensaje: "Proceso exitoso: Historial actualizado correctamente" });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: No se pudo registrar el cambio en el historial" });
    }
}

export {
    obtenerHistorialPeticion,
    obtenerHistorialPorAlumno,
    obtenerHistorialPeticiones,
    registrarHistorialPeticion
};