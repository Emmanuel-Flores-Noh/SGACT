import { Router, Request, Response } from 'express'
import {obtenerPeticionAlumno, obtenerPeticionesTramites, crearPeticionTramite, actualizarEstadoPeticion} from '../controllers/peticion.controller'

const peticionesTramite = Router();
peticionesTramite.put('/:id/estado', actualizarEstadoPeticion);
peticionesTramite.post('/', crearPeticionTramite)
peticionesTramite.get('/', obtenerPeticionesTramites);
peticionesTramite.get('/alumno/:alumno_id', obtenerPeticionAlumno)

export default peticionesTramite;