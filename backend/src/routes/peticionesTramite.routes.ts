import { Router, Request, Response } from 'express'
import { obtenerPeticionID, obtenerPeticiones, crearPeticion, actualizarPeticion} from '../controllers/peticion.controller'

const peticionesTramite = Router();
// Consultas
peticionesTramite.get('/:id',obtenerPeticionID);
peticionesTramite.get('/',obtenerPeticiones);
peticionesTramite.put('/',actualizarPeticion);
peticionesTramite.post('/',crearPeticion);
import {obtenerPeticionAlumno, obtenerPeticionesTramites, crearPeticionTramite, actualizarEstadoPeticion} from '../controllers/peticion.controller'
import { previsualizarDocumento } from '../controllers/preview.controller';

const peticionesTramite = Router();
peticionesTramite.post('/:id/preview', previsualizarDocumento);
peticionesTramite.post('/preview', previsualizarDocumento);
peticionesTramite.put('/:id/estado', actualizarEstadoPeticion);
peticionesTramite.post('/', crearPeticionTramite)
peticionesTramite.get('/', obtenerPeticionesTramites);
peticionesTramite.get('/alumno/:alumno_id', obtenerPeticionAlumno)

export default peticionesTramite;