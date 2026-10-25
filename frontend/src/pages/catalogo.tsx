import React, { useEffect, useState } from "react"
import { obtenerProcedimientos, Procedimiento } from "../api/procedimientos"

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'listo'; procedimientos: Procedimiento[] };

const formatoCosto = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

const botonPrimario =
  "rounded-sm bg-azul-institucional px-6 py-2.5 text-base font-semibold text-blanco transition-colors duration-150 hover:bg-azul-institucional-enfoque active:bg-azul-institucional-enfoque focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-institucional focus-visible:ring-offset-2";

export default function Catalogo(): React.JSX.Element {
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' });

  const cargar = () => {
    setCarga({ estado: 'cargando' });
    obtenerProcedimientos()
      .then((procedimientos) => setCarga({ estado: 'listo', procedimientos }))
      .catch(() => setCarga({ estado: 'error' }));
  };

  useEffect(cargar, []);

  const handleSolicitar = (procedimiento: Procedimiento) => {
    console.log('Trámite solicitado:', procedimiento);
  };

  return <div className="min-h-screen bg-gris-050 font-sgact">
    <header className="bg-azul-institucional selection:bg-blanco selection:text-azul-institucional">
      <div className="mx-auto flex max-w-4xl items-center gap-5 px-4 py-6 escritorio:gap-6 escritorio:py-8">
        <img
          src="/escudo-uady-blanco.png"
          alt="Escudo de la Universidad Autónoma de Yucatán"
          width={178}
          height={290}
          className="h-20 w-auto shrink-0 escritorio:h-24"
        />
        <div>
          <p className="text-sm font-semibold tracking-wide text-blanco">
            <span>FACULTAD DE MATEMÁTICAS</span>
            <span className="hidden escritorio:inline"> — </span>
            <br className="escritorio:hidden" />
            <span>UNIVERSIDAD AUTÓNOMA DE YUCATÁN</span>
          </p>
          <h1 className="mt-1 text-banner font-extrabold leading-tight tracking-tight text-blanco">
            Catálogo de trámites
          </h1>
        </div>
      </div>
    </header>

    <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10" aria-live="polite" aria-busy={carga.estado === 'cargando'}>
      {carga.estado === 'cargando' && (
        <ul className="divide-y divide-gris-200 rounded bg-blanco shadow-sm" aria-label="Cargando trámites">
          {[0, 1].map((i) => (
            <li key={i} className="p-6 motion-safe:animate-pulse">
              <div className="h-5 w-48 rounded-sm bg-gris-100" />
              <div className="mt-3 h-4 w-full max-w-md rounded-sm bg-gris-100" />
              <div className="mt-2 h-4 w-2/3 max-w-sm rounded-sm bg-gris-100" />
            </li>
          ))}
        </ul>
      )}

      {carga.estado === 'error' && (
        <div className="rounded bg-blanco p-6 shadow-sm">
          <p className="text-base font-semibold text-tinta">No se pudo cargar el catálogo de trámites.</p>
          <p className="mt-1 text-base text-gris-700">Revisa tu conexión e inténtalo de nuevo.</p>
          <button
            type="button"
            onClick={cargar}
            className="mt-4 rounded-sm border border-azul-institucional px-4 py-2 text-sm font-semibold text-azul-institucional transition-colors duration-150 hover:bg-gris-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-institucional focus-visible:ring-offset-2"
          >
            Reintentar
          </button>
        </div>
      )}

      {carga.estado === 'listo' && carga.procedimientos.length === 0 && (
        <div className="rounded bg-blanco p-6 shadow-sm">
          <p className="text-base text-tinta">No hay trámites disponibles por ahora.</p>
        </div>
      )}

      {carga.estado === 'listo' && carga.procedimientos.length > 0 && (
        <ul className="divide-y divide-gris-200 rounded bg-blanco shadow-sm">
          {carga.procedimientos.map((procedimiento) => (
            <li
              key={procedimiento.id}
              className="flex flex-col gap-6 p-6 escritorio:flex-row escritorio:items-center escritorio:gap-10"
            >
              <div className="flex-1">
                <h2 id={`tramite-${procedimiento.id}`} className="text-xl font-bold text-azul-texto">
                  {procedimiento.nombre}
                </h2>
                <p className="mt-2 max-w-prose text-base text-tinta">{procedimiento.descripcion}</p>
                <p className="mt-3 text-sm text-gris-700">
                  Vigencia de {procedimiento.vigencia_meses} {procedimiento.vigencia_meses === 1 ? 'mes' : 'meses'}
                </p>
              </div>

              <div className="flex items-center justify-between gap-6 escritorio:flex-col escritorio:items-end escritorio:gap-3">
                <p className="text-xl font-bold tabular-nums text-tinta">
                  {formatoCosto.format(procedimiento.costo)}
                </p>
                <button
                  type="button"
                  onClick={() => handleSolicitar(procedimiento)}
                  aria-describedby={`tramite-${procedimiento.id}`}
                  className={botonPrimario}
                >
                  Solicitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  </div>
}
