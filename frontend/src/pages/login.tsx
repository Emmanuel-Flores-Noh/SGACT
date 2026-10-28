import React, { useState } from "react"
import { login } from "../api/usuario";
// @ts-ignore
import { useLocation, useNavigate } from "react-router-dom";
import { TiWarning } from "react-icons/ti";

function warningMessage(texto: string) {
  if( texto === "" ) {
    return null;
  }
  
  return <div className="flex gap-2 items-center justify-center bg-dorado-encabezado text-blanco text-center shadow-xl m-2 p-2 rounded">
    <TiWarning className="text-xl"/>
    <p>
      {texto}
    </p>
  </div>
}

export default function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const mensajeInicial = (location.state as { mensaje?: string } | null)?.mensaje ?? '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [warning, setWarning] = useState(mensajeInicial);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const successful = await login(email, password);

    if(successful) {
      navigate('/dashboard', { replace: true });
    }
    else {
      setWarning("Credenciales incorrectas");
    }
  }; 

  const inputClass = "w-full rounded-sm border border-gris-300 bg-blanco px-3.5 py-2.5 text-base text-tinta placeholder:text-gris-500 outline-none transition focus:border-azul-institucional focus:ring-1 focus:ring-azul-institucional";

  return <div className="flex min-h-screen flex-col items-center justify-center bg-azul-institucional px-4 font-sgact">
    <div className="w-full max-w-sm rounded bg-blanco p-8 shadow-lg">
      <h2 className="mb-2 text-center text-xl font-bold text-azul-institucional">
        SGACT
      </h2>
      
      <hr />

      <h2 className="my-2 font-bold text-azul-texto text-center">
        Iniciar sesión
      </h2>
      
      { warningMessage(warning) }
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-gris-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setWarning("");
            }}
            placeholder="correo@ejemplo.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-gris-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setWarning("");
            }}
            placeholder="******"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-sm bg-azul-institucional py-2.5 text-base font-semibold text-blanco transition hover:bg-azul-institucional-enfoque active:bg-azul-institucional-enfoque focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-institucional focus-visible:ring-offset-2"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
}
