import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export default function verificarRevisor(req: Request, res: Response, next: NextFunction) {
    if( req.session.rol?.toLocaleLowerCase() != "revisor" ) {
        res.status(StatusCodes.FORBIDDEN).send({mensaje: "No tienes autorizacion para este endpoint"})
        return;
    }
    
    if(! req.session.usuarioId ) {
        res.status(StatusCodes.FORBIDDEN).send({mensaje: "No tienes autorizacion para este endpoint"})
        return;
    }
    
    next();
}