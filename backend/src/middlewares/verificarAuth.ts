import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Usuario from '../models/usuario';


export default async function verificarAuth(req: Request, res: Response, next: NextFunction) {
    if( req.session.usuarioId === undefined ) {
        res.sendStatus(StatusCodes.FORBIDDEN);
        return;
    }
    
    const id = req.session.usuarioId;
    const cookie = req.signedCookies.login_cookie;
    
    if( await Usuario.comprobarCookie(id, cookie) ) {
        next();
        return;
    }
    
    res.sendStatus(StatusCodes.FORBIDDEN);
}