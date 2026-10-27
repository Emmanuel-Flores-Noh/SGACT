import { Request, Response } from "express";
import Procedimiento from "../models/procedimiento";

async function obtenerProcedimientos(req: Request, res: Response) {
    try {
        const procedimientos = await Procedimiento.obtenerTodos();
        res.json(procedimientos);
    } catch (error) {
        res.status(500).json({ mensaje: "No se pudo obtener el catálogo de trámites" });
    }
}

async function obtenerProcedimiento(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ mensaje: "Id de procedimiento inválido" });
    }

    try {
        const procedimiento = await Procedimiento.obtenerPorId(id);

        if (procedimiento === undefined) {
            return res.status(404).json({ mensaje: "No se encontró el procedimiento" });
        }

        res.json(procedimiento);
    } catch (error) {
        res.status(500).json({ mensaje: "No se pudo obtener el procedimiento" });
    }
}

export {
    obtenerProcedimientos,
    obtenerProcedimiento
}
