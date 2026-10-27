import { Request, Response } from "express";
import PeticionTramite from "../models/peticionTramite";
import Procedimiento from "../models/procedimiento";

const METODOS_PAGO = [
    'Tarjeta de crédito o débito',
    'Transferencia bancaria',
    'Pago en OXXO',
];

async function confirmarPago(req: Request, res: Response) {
    const alumno_id = req.session.usuarioId;

    if (alumno_id === undefined) {
        return res.status(403).json({ mensaje: "No has iniciado sesión" });
    }

    if (req.session.rol !== 'Alumno') {
        return res.status(403).json({ mensaje: "Solo los alumnos pueden solicitar trámites" });
    }

    const procedimiento_id = Number(req.body.procedimiento_id);
    const metodo_pago = req.body.metodo_pago;

    if (!Number.isInteger(procedimiento_id) || !METODOS_PAGO.includes(metodo_pago)) {
        return res.status(400).json({ mensaje: "Datos de pago incompletos o inválidos" });
    }

    try {
        const procedimiento = await Procedimiento.obtenerPorId(procedimiento_id);

        if (procedimiento === undefined) {
            return res.status(404).json({ mensaje: "No se encontró el procedimiento" });
        }

        const { peticionId, pagoId } = await PeticionTramite.crearPeticionConPago(
            alumno_id,
            procedimiento_id,
            metodo_pago,
            procedimiento.costo
        );

        res.status(201).json({
            peticion_id: peticionId,
            pago_id: pagoId,
            estado: 'En confirmación de pago',
            monto: procedimiento.costo,
        });
    } catch (error) {
        res.status(500).json({ mensaje: "No se pudo procesar el pago del trámite" });
    }
}

export {
    confirmarPago,
    METODOS_PAGO,
}
