import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import PeticionTramite from "../models/peticionTramite";
import Usuario from "../models/usuario";
import obtenerConstancia from "../services/obtenerConstancia";

async function descargarDocumento(req: Request, res: Response) {
    if (!req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No ha iniciado sesión" });
    }

    const peticion_id = Number(req.params.id);
    if (!Number.isInteger(peticion_id) || peticion_id <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ mensaje: "Parámetros: ID de petición inválido o vacío" });
    }

    try {
        const peticion = await PeticionTramite.obtenerPeticionPorId(peticion_id);
        if (!peticion) {
            return res.status(StatusCodes.NOT_FOUND).json({ mensaje: "Proceso fallido: Petición no encontrada" });
        }

        const esRevisor = await Usuario.comprobarRevisor(Number(req.session.usuarioId));
        if (!esRevisor && Number(peticion.alumno_id) !== Number(req.session.usuarioId)) {
            return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: No puedes descargar documentos de otros alumnos" });
        }

        if (peticion.estado === 'Archivado') {
            return res.status(StatusCodes.GONE).json({ mensaje: "El documento ya no está disponible: el trámite fue archivado" });
        }

        if (peticion.estado !== 'Finalizado') {
            return res.status(StatusCodes.CONFLICT).json({ mensaje: "El documento estará disponible cuando el trámite finalice" });
        }

        const ruta = await obtenerConstancia(peticion);
        if (!ruta) {
            return res.status(StatusCodes.CONFLICT).json({ mensaje: "El documento no está disponible: el trámite no tiene una firma registrada" });
        }

        return res.download(ruta, `constancia-${peticion_id}.pdf`, (error) => {
            if (error) {
                console.error("Error al enviar la constancia:", error);
            }
        });
    } catch (error) {
        console.error("Error al obtener la constancia:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ mensaje: "Proceso fallido: No se pudo generar el documento" });
    }
}

export {
    descargarDocumento
};
