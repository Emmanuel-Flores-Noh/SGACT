import { Request, Response } from "express";
import Usuario from "../models/usuario";

async function obtenerUsuario(req: Request, res: Response) {
    res.send("CAMBIAR USUARIO CONTROLLER")
}


export {
    obtenerUsuario
}