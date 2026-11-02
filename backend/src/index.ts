import express, { Request, Response } from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import loginRoutes from './routes/login.routes';
import procedimientoRoutes from './routes/procedimiento.routes';
import peticionesTramite from './routes/peticionesTramite.routes';
import historialPeticiones from './routes/historial.routes';
import firmasRevisor from './routes/firmasRevisor.routes';
import verificarAuth from './middlewares/verificarAuth';
import verificarRevisor from './middlewares/verificarRevisor';

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
// @ts-ignore
app.use(cookieParser(process.env.COOKIE_SECRET))
// @ts-ignore
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 1, // 1 hora
    sameSite: 'lax'
  }
}))

app.use('/api/usuario', verificarAuth)
app.use('/api/usuario', usuarioRoutes)
app.use('/api/auth', loginRoutes)
app.use('/api/procedimientos', procedimientoRoutes)
app.use('/api/peticiones',  peticionesTramite)
app.use('/api/historial', historialPeticiones)
app.use('/api/firmas', verificarAuth, verificarRevisor)
app.use('/api/firmas', firmasRevisor)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});