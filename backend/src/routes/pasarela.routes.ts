import { Router } from 'express'
import { confirmarPago } from '../controllers/pasarela.controller'

const pasarelaRoutes = Router();

pasarelaRoutes.post('/confirmar', confirmarPago);

export default pasarelaRoutes;
