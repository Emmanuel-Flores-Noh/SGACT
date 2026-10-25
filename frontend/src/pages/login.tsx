import React, { useState } from "react"

export default function Login(): React.JSX.Element {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Credenciales enviadas:', { email, password });
  };


    return <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight text-gray-900">
            SGACT
        </h2>
        <hr />
        <h3 className="my-5 text-center">
            Iniciar sesion
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="*******"
              className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98]"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
}