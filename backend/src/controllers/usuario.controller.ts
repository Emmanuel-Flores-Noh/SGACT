import { Request, Response } from "express";
import Usuario from "../models/usuario";
import { StatusCodes } from "http-status-codes";

async function obtenerUsuario(req: Request, res: Response) {
    // @ts-ignore El middleware ya determino que no es undefined y pertenece al usuario
    const usuario = await Usuario.obtenerUsuarioPorId(req.session.usuarioId);
    res.send(usuario);
}

async function obtenerOtroUsuario(req: Request, res: Response) {
    const {userID} = req.body;
    
    if( userID === undefined ) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    // @ts-ignore El middleware ya determino
    if( await Usuario.comprobarRevisor(req.session.usuarioId) ) {
        res.send(await Usuario.obtenerUsuarioPorId(userID));
        return;
    }

    res.sendStatus(StatusCodes.FORBIDDEN);        
}

export {
    obtenerUsuario,
    obtenerOtroUsuario
}