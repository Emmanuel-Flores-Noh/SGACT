import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { descargarConstancia, obtenerPeticionesAlumno, PeticionTramite } from "../../api/peticiones"
import { Alert, Badge, Button, LoadingScreen } from "../../components"

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'listo'; peticiones: PeticionTramite[] };

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

/** Acción sobre la constancia según el estado: descarga, espera o no disponible */
function AccionConstancia({ peticion }: { peticion: PeticionTramite }): React.JSX.Element {
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idAyuda = `constancia-ayuda-${peticion.id}`;

  if (peticion.estado === 'Archivado') {
    return <p className="text-sm text-gris-700 escritorio:max-w-60 escritorio:text-right">
        El documento ya no está disponible: las constancias se archivan 6 meses después de emitirse.
      </p>;
  }

  if (peticion.estado !== 'Finalizado') {
    return <div className="flex flex-col gap-1 escritorio:items-end">
        <Button disabled aria-describedby={idAyuda}>
          Descargar PDF
        </Button>
        <p id={idAyuda} className="text-sm text-gris-700">Disponible cuando el trámite finalice.</p>
      </div>;
  }

  const descargar = async () => {
    setDescargando(true);
    setError(null);

    try {
      await descargarConstancia(peticion.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo descargar la constancia');
    } finally {
      setDescargando(false);
    }
  };

  return <div className="flex flex-col gap-2 escritorio:items-end">
      <Button onClick={descargar} disabled={descargando}>
        {descargando ? 'Descargando…' : 'Descargar PDF'}
      </Button>
      {error && <Alert type="error" className="escritorio:max-w-72">{error}</Alert>}
    </div>;
}

export default function Historial(): React.JSX.Element {
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' });
  const navigate = useNavigate();

  const cargar = async () => {
    setCarga({ estado: 'cargando' });

    try {
      const peticiones = await obtenerPeticionesAlumno();
      setCarga({ estado: 'listo', peticiones });
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
            {carga.peticiones.map((peticion) => <li
                key={peticion.id}
                className="flex flex-col gap-4 p-5 escritorio:flex-row escritorio:items-center escritorio:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h2 className="text-base font-bold text-tinta">
                      {peticion.nombre_tramite ?? `Trámite #${peticion.procedimiento_id}`}
                    </h2>
                    <Badge estado={peticion.estado} />
                  </div>
                  <p className="mt-1 text-sm text-gris-700">
                    Folio <span className="tabular-nums">#{peticion.id}</span>
                    {" · "}
                    Solicitado el {formatearFecha(peticion.fecha_solicitud)}
                  </p>
                </div>
                <AccionConstancia peticion={peticion} />
              </li>)}
          </ul>}
    </main>;
}
