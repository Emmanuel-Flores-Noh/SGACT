import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/login";
import Dashboard from './pages/dashboard';
import Catalogo from './pages/alumno/catalogo';
import PasarelaPago from './pages/alumno/pasarelaPago';
import PasarelaResumen from './pages/alumno/pasarelaResumen';
import Historial from './pages/alumno/historial';


export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="alumno">
          <Route path={"catalogo"} element={<Catalogo />}/>
          <Route path={"pasarela/:procedimientoId"} element={<PasarelaResumen />}/>
          <Route path={"pasarela/:procedimientoId/pago"} element={<PasarelaPago />}/>
          <Route path="historial" element={<Historial />} />
        </Route>
      </Route>
    </Routes>
  );
}
