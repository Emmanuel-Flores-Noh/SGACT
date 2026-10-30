import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export default function verificarRevisor(req: Request, res: Response, next: NextFunction) {
    if (!req.session || !req.session.rol || !req.session.usuarioId) {
        return res.status(StatusCodes.FORBIDDEN).json({ mensaje: "Sin acceso: Se requiere iniciar sesión" });
    }
    
    next();
}