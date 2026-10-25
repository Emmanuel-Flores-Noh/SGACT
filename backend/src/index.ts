import express, { Request, Response } from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import loginRoutes from './routes/login.routes';

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(express.json());
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

app.use('/api/usuario', usuarioRoutes)
app.use('/api/login', loginRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});