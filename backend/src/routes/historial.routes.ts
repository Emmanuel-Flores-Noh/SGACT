import { Router } from 'express';
import { obtenerHistorialPeticion, obtenerHistorialPorAlumno, obtenerHistorialPeticiones, registrarHistorialPeticion } from '../controllers/historial.controller';

const historialPeticiones = Router();

historialPeticiones.get('/total', obtenerHistorialPeticiones);
historialPeticiones.get('/alumno/:alumno_id?', obtenerHistorialPorAlumno);
historialPeticiones.get('/:peticion_id', obtenerHistorialPeticion);
historialPeticiones.post('/', registrarHistorialPeticion);

export default historialPeticiones;