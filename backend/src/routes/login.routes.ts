import { Router, Request, Response } from 'express'
import { login, logout } from '../controllers/login.controller'

const loginRoutes = Router();

loginRoutes.post('/login', login);
loginRoutes.get('/logout', logout);

export default loginRoutes;