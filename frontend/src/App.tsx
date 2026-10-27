import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/login";
import Dashboard from './pages/dashboard';
import Catalogo from './pages/alumno/catalogo';
import PasarelaPago from './pages/alumno/pasarelaPago';


export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="alumno">
          <Route path={"catalogo"} element={<Catalogo />}/>
          <Route path={"pasarela/:procedimientoId"} element={<PasarelaPago />}/>
          <Route path="historial" />
        </Route>
      </Route>
    </Routes>
  );
}
