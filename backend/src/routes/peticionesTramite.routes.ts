import { Router, Request, Response } from 'express'
import { obtenerPeticionID, obtenerPeticiones, crearPeticion, actualizarPeticion} from '../controllers/peticion.controller'

const peticionesTramite = Router();
// Consultas
peticionesTramite.get('/id',obtenerPeticionID);
peticionesTramite.get('/',obtenerPeticiones);
peticionesTramite.put('/',actualizarPeticion);
peticionesTramite.post('/',crearPeticion);

export default peticionesTramite;