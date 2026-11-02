import { Router } from 'express'
import { obtenerProcedimiento, obtenerProcedimientos } from '../controllers/procedimiento.controller'

const procedimientoRoutes = Router();

procedimientoRoutes.get('/', obtenerProcedimientos)
procedimientoRoutes.get('/:id', obtenerProcedimiento)

export default procedimientoRoutes;
