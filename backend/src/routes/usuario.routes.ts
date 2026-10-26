import { Router, Request, Response } from 'express'
import { obtenerOtroUsuario, obtenerUsuario } from '../controllers/usuario.controller';

const usuarioRoutes = Router();

usuarioRoutes.get('/', obtenerUsuario)
usuarioRoutes.post('/', obtenerOtroUsuario)

export default usuarioRoutes;