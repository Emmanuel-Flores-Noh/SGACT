import { Request, Response } from "express";
import Usuario from "../models/usuario"
import StatusCodes from "http-status-codes"

async function login(req: Request, res: Response) {
    const {correo, password} = req.body;

    if( ! correo || ! password ) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    const usuario = await Usuario.obtenerUsuarioPorCorreo(correo);
    
    if( usuario === undefined ) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
    }

    if( usuario.correo === correo && usuario.password === password) {
        res.cookie("login_cookie", "abcdexyz" , {
            signed: true,
            httpOnly: true
        });
        res.sendStatus(StatusCodes.OK);
        return;
    }
    
    res.sendStatus(StatusCodes.UNAUTHORIZED);
}


export {
    login
}