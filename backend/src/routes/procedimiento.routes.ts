import { Router } from 'express'
import { obtenerProcedimientos } from '../controllers/procedimiento.controller'

const procedimientoRoutes = Router();

procedimientoRoutes.get('/', obtenerProcedimientos)

export default procedimientoRoutes;
