import React, { useEffect, useState } from "react"
import { obtenerProcedimientos, Procedimiento } from "../../api/procedimientos"
import { CardProcedimiento } from "../../components";

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'listo'; procedimientos: Procedimiento[] };

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
  
  const gestionarCarga = () => {
    switch( carga.estado ) {
    case "cargando":
      return <ul className="divide-y divide-gris-200 rounded bg-blanco shadow-sm" aria-label="Cargando trámites">
          {[0, 1].map((i) => (
            <li key={i} className="p-6 motion-safe:animate-pulse">
              <div className="h-5 w-48 rounded-sm bg-gris-100" />
              <div className="mt-3 h-4 w-full max-w-md rounded-sm bg-gris-100" />
              <div className="mt-2 h-4 w-2/3 max-w-sm rounded-sm bg-gris-100" />
            </li>
          ))}
        </ul>
    case "error":
      return <div className="rounded bg-blanco p-6 shadow-sm">
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
    case "listo":
      if(carga.procedimientos.length === 0) {
        return <div className="rounded bg-blanco p-6 shadow-sm">
          <p className="text-base text-tinta">No hay trámites disponibles por ahora.</p>
        </div>
      }
      
      return <ul className="divide-y divide-gris-200 rounded bg-blanco shadow-sm">
          {carga.procedimientos.map((procedimiento) => (
            <li key={procedimiento.id}>
              <CardProcedimiento
                id={procedimiento.id}
                nombre={procedimiento.nombre}
                descripcion={procedimiento.descripcion}
                costo={procedimiento.costo}
                vigenciaMeses={procedimiento.vigencia_meses}
                onSolicitar={()=>handleSolicitar(procedimiento)}
              ></CardProcedimiento>
            </li>
          ))}
        </ul>
    }
  }

  return <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10" aria-live="polite" aria-busy={carga.estado === 'cargando'}>
    {gestionarCarga()}
  </main>
}