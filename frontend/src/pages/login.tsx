import React, { useState } from "react"

export default function Login(): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Credenciales enviadas:', { email, password });
  };

  const inputClass =
    "w-full rounded-sm border border-gris-300 bg-blanco px-3.5 py-2.5 text-base text-tinta placeholder:text-gris-500 outline-none transition focus:border-azul-institucional focus:ring-1 focus:ring-azul-institucional";

    return <div className="flex min-h-screen flex-col items-center justify-center bg-azul-institucional px-4 font-sgact">
      <div className="w-full max-w-sm rounded bg-blanco p-8 shadow-lg">
        <h2 className="mb-6 text-center text-xl font-bold text-azul-texto">
            Iniciar sesión
        </h2>

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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
