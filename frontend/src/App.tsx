import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/login";
import Dashboard from './pages/dashboard';
import Catalogo from './pages/alumno/catalogo';


export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="alumno">
          <Route path="catalogo" element={<Catalogo />}/>
          <Route path="historial" />
        </Route>
        <Route path="revisor">
          <Route path="bandeja" />
          <Route path="historial" />
        </Route>
      </Route>
    </Routes>
  );
}