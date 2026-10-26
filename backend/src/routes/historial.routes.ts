import { Router, Request, Response } from 'express'
import {obtenerHistorialPeticion} from '../controllers/historial.controller';

const historialPeticiones = Router();
historialPeticiones.get('/:peticion_id', obtenerHistorialPeticion);

export default historialPeticiones;
