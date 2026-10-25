import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/login";
import Catalogo from "./pages/catalogo";


export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/catalogo" element={<Catalogo />}></Route>
    </Routes>
  );
}
