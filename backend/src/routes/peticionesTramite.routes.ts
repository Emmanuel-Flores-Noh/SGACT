import { Router } from 'express';
import {
    obtenerPeticionID,
    obtenerPeticiones,
    crearPeticion,
    actualizarPeticion,
    actualizarEstadoPeticion
} from '../controllers/peticion.controller';
import { previsualizarDocumento } from '../controllers/preview.controller';

const peticionesTramite = Router();

// Previsualización de documentos
peticionesTramite.post('/:id/preview', previsualizarDocumento);
peticionesTramite.post('/preview', previsualizarDocumento);

// Actualización de estado / firma
peticionesTramite.put('/:id/estado', actualizarEstadoPeticion);

// Consultas y operaciones
peticionesTramite.get('/:id', obtenerPeticionID);
peticionesTramite.get('/', obtenerPeticiones);
peticionesTramite.put('/', actualizarPeticion);
peticionesTramite.post('/', crearPeticion);

export default peticionesTramite;
