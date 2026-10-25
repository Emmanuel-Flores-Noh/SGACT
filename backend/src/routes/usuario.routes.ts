import { Router, Request, Response } from 'express'
import { obtenerUsuario } from '../controllers/usuario.controller';

const usuarioRoutes = Router();

usuarioRoutes.get('/', obtenerUsuario)

export default usuarioRoutes;