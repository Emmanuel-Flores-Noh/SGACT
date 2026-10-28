import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getUserData } from "../../api/usuario"
import { obtenerPeticionesAlumno, PeticionTramite } from "../../api/peticiones"
import { obtenerProcedimientos, Procedimiento } from "../../api/procedimientos"
import { Button, LoadingScreen, StatusBadge } from "../../components"
import type { Usuario } from "../../api/usuario"

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'listo'; peticiones: PeticionTramite[]; procedimientos: Procedimiento[] };

const formatoFecha = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatearFecha(valor: string): string {
  const fecha = new Date(valor.replace(' ', 'T'));

  if (Number.isNaN(fecha.getTime())) {
    return valor;
  }

  return formatoFecha.format(fecha);
}

export default function Historial(): React.JSX.Element {
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' });
  const navigate = useNavigate();

  const cargar = async () => {
    setCarga({ estado: 'cargando' });

    try {
      const respuestaUsuario = await getUserData();

      if (!respuestaUsuario.ok) {
        throw new Error('No se pudo obtener el usuario');
      }

      const usuario: Usuario = await respuestaUsuario.json();
      const [peticiones, procedimientos] = await Promise.all([
        obtenerPeticionesAlumno(usuario.id),
        obtenerProcedimientos(),
      ]);

      setCarga({ estado: 'listo', peticiones, procedimientos });
    } catch {
      setCarga({ estado: 'error' });
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const irAlCatalogo = () => navigate('/dashboard/alumno/catalogo');

  if (carga.estado === 'cargando') {
    return <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
        <LoadingScreen fullScreen={false} mensaje="Cargando tus trámites..." />
      </main>;
  }

  if (carga.estado === 'error') {
    return <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
        <div className="rounded bg-blanco p-6 shadow-sm">
          <h1 className="text-xl font-bold text-azul-texto">Panel de seguimiento</h1>
          <p className="mt-3 text-base font-semibold text-tinta">No se pudieron cargar tus trámites.</p>
          <p className="mt-1 text-base text-gris-700">Revisa tu conexión e inténtalo de nuevo.</p>
          <Button className="mt-4" onClick={cargar}>
            Reintentar
          </Button>
        </div>
      </main>;
  }

  return <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
      <h1 className="text-xl font-bold text-azul-texto">Panel de seguimiento</h1>
      <p className="mt-1 text-base text-gris-700">Consulta el estado de tus trámites solicitados.</p>

      {carga.peticiones.length === 0
        ? <div className="mt-6 rounded bg-blanco p-6 shadow-sm">
            <p className="text-base font-semibold text-tinta">Aún no tienes solicitudes registradas.</p>
            <p className="mt-1 text-base text-gris-700">Cuando solicites un trámite aparecerá aquí con su estado.</p>
            <Button className="mt-4" onClick={irAlCatalogo}>
              Solicitar un trámite
            </Button>
          </div>
        : <ul className="mt-6 divide-y divide-gris-200 rounded bg-blanco shadow-sm" aria-label="Tus trámites">
            {carga.peticiones.map((peticion) => {
              const procedimiento = carga.procedimientos.find(
                (item) => item.id === peticion.procedimiento_id
              );

              return <li
                key={peticion.id}
                className="flex flex-col gap-3 p-5 escritorio:flex-row escritorio:items-center escritorio:justify-between"
              >
                <div>
                  <h2 className="text-base font-bold text-tinta">
                    {procedimiento?.nombre ?? `Trámite #${peticion.procedimiento_id}`}
                  </h2>
                  <p className="mt-1 text-sm text-gris-700">
                    Folio <span className="tabular-nums">#{peticion.id}</span>
                    {" · "}
                    Solicitado el {formatearFecha(peticion.fecha_solicitud)}
                  </p>
                </div>
                <StatusBadge estado={peticion.estado} />
              </li>;
            })}
          </ul>}
    </main>;
}
