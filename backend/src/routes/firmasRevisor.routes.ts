import { Router } from 'express'
import {
    obtenerFirmasPreconfigurardasRevisor,
    agregarFirmaPreconfigurada,
    agregarFirma
} from '../controllers/firmasRevisor.controller'

const firmasRevisor = Router();

firmasRevisor.get('/preconfiguradas', obtenerFirmasPreconfigurardasRevisor);
firmasRevisor.post('/preconfiguradas', agregarFirmaPreconfigurada);
firmasRevisor.post('/', agregarFirma);

export default firmasRevisor;
