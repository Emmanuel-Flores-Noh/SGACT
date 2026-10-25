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

export {
    obtenerProcedimientos
}
