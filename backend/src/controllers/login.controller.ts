import { Request, Response } from "express";
import Usuario from "../models/usuario"
import StatusCodes from "http-status-codes"

async function login(req: Request, res: Response) {
    const {correo, password} = req.body;

    if( ! correo || ! password ) {
        res.sendStatus(StatusCodes.BAD_REQUEST).send({ message: "No se ha proporcionado todos los datos" });
        return;
    }

    const usuario = await Usuario.obtenerUsuarioPorCorreo(correo);
    
    if( usuario === undefined ) {
        res.sendStatus(StatusCodes.UNAUTHORIZED).send({ message: "No se ha encontrado el usuario" });
        return;
    }

    if( usuario.correo === correo && usuario.password === password) {
        const cookie_value = Date.now().toString();

        res.cookie("login_cookie", cookie_value, {
            signed: true,
            httpOnly: true
        });;
        
        Usuario.actualizarLoginCookie(usuario.id, cookie_value);

        req.session.isAuth = true;
        req.session.rol = usuario.rol;
        req.session.usuarioId = usuario.id;

        res.sendStatus(StatusCodes.OK);
        return;
    }
    
    res.sendStatus(StatusCodes.UNAUTHORIZED).send({ message: "Credenciales incorrectas" });
}

async function logout(req: Request, res: Response) {
    if( req.session.usuarioId === undefined ) {
        res.sendStatus(StatusCodes.FORBIDDEN);
        return;
    }
    
    const id = req.session.usuarioId;
    const cookie = req.signedCookies.login_cookie;
    
    if( await Usuario.comprobarCookie(id, cookie) ) {
        Usuario.actualizarLoginCookie(id, undefined);
        res.clearCookie("login_cookie", {
            signed: true,
            httpOnly: true
        })
        res.sendStatus(StatusCodes.OK);
        return;
    }
    
    res.sendStatus(StatusCodes.FORBIDDEN);
}

export {
    login,
    logout
}