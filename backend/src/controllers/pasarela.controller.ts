import { Request, Response } from "express";
import PeticionTramite from "../models/peticionTramite";
import Procedimiento from "../models/procedimiento";
import { validarDatosPago } from "../validators/pago.validator";
import { ESTADO_EN_CONFIRMACION_DE_PAGO } from "../interfaces";

async function confirmarPago(req: Request, res: Response) {
    const alumno_id = req.session.usuarioId;

    if (alumno_id === undefined) {
        return res.status(403).json({ mensaje: "No has iniciado sesión" });
    }

    if (req.session.rol !== 'Alumno') {
        return res.status(403).json({ mensaje: "Solo los alumnos pueden solicitar trámites" });
    }

    const procedimiento_id = Number(req.body.procedimiento_id);

    if (!Number.isInteger(procedimiento_id) || procedimiento_id <= 0) {
        return res.status(400).json({ mensaje: "El trámite seleccionado no es válido." });
    }

    const validacion = validarDatosPago(req.body.metodo_pago, req.body.datos_pago);

    if (!validacion.valido) {
        return res.status(400).json({
            mensaje: "Revisa los datos de pago.",
            errores: validacion.errores,
        });
    }

    try {
        const procedimiento = await Procedimiento.obtenerPorId(procedimiento_id);

        if (procedimiento === undefined) {
            return res.status(404).json({ mensaje: "No se encontró el procedimiento" });
        }

        const { peticionId, pagoId } = await PeticionTramite.crearPeticionConPago(
            alumno_id,
            procedimiento_id,
            validacion.metodo_label,
            procedimiento.costo
        );

        res.status(201).json({
            peticion_id: peticionId,
            pago_id: pagoId,
            estado: ESTADO_EN_CONFIRMACION_DE_PAGO,
            monto: procedimiento.costo,
        });
    } catch (error) {
        res.status(500).json({ mensaje: "No se pudo procesar el pago del trámite" });
    }
}

export {
    confirmarPago,
}
