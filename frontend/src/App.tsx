import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from "./pages/login";


export default function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
    </Routes>
  );
}
