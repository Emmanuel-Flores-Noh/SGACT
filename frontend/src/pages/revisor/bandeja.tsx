import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../api/usuario";
import { obtenerPeticionesRevisor, PeticionDetalladaTramite } from "../../api/peticiones";
import { Button, LoadingScreen, StatusBadge } from "../../components";

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'listo'; peticiones: PeticionDetalladaTramite[] };

const formatoFecha = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function formatearFecha(valor: string): string {
  if (!valor) return '';
  const fecha = new Date(valor.replace(' ', 'T'));

  if (Number.isNaN(fecha.getTime())) {
    return valor;
  }

  return formatoFecha.format(fecha);
}

export default function BandejaRevisor(): React.JSX.Element {
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' });
  const navigate = useNavigate();

  const cargar = async () => {
    setCarga({ estado: 'cargando' });

    try {
      const respuestaUsuario = await getUserData();
      if (!respuestaUsuario.ok) {
        throw new Error('No se pudo obtener el usuario');
      }

      
      const peticionesRaw = await obtenerPeticionesRevisor() as PeticionDetalladaTramite[];
      
      const peticionesFiltradas = peticionesRaw
        .filter((p) => p.estado === 'En trámite')
        .sort((a, b) => {
          const fechaA = new Date(a.fecha_solicitud.replace(' ', 'T')).getTime();
          const fechaB = new Date(b.fecha_solicitud.replace(' ', 'T')).getTime();
          return fechaA - fechaB;
        });

      setCarga({ estado: 'listo', peticiones: peticionesFiltradas });
    } catch {
      setCarga({ estado: 'error' });
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const seleccionarPeticion = (id: number) => {
    navigate(`/dashboard/revisor/bandeja/${id}`);
  };

  if (carga.estado === 'cargando') {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
        <LoadingScreen fullScreen={false} mensaje="Cargando peticiones pendientes..." />
      </main>
    );
  }

  if (carga.estado === 'error') {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
        <div className="rounded bg-blanco p-6 shadow-sm">
          <h1 className="text-xl font-bold text-azul-texto">Panel de Revisor</h1>
          <p className="mt-3 text-base font-semibold text-tinta">No se pudieron cargar las peticiones.</p>
          <p className="mt-1 text-base text-gris-700">Verifique sus permisos de rol Revisor o su conexión.</p>
          <Button className="mt-4" onClick={cargar}>
            Reintentar
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
      <h1 className="text-xl font-bold text-azul-texto">Peticiones Pendientes</h1>
      <p className="mt-1 text-base text-gris-700">Trámites en curso que requieren su revisión y firma.</p>

      {carga.peticiones.length === 0 ? (
        <div className="mt-6 rounded bg-blanco p-6 shadow-sm">
          <p className="text-base font-semibold text-tinta">No hay peticiones pendientes.</p>
          <p className="mt-1 text-base text-gris-700">Actualmente no existen solicitudes en estado "En trámite".</p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-gris-200 rounded bg-blanco shadow-sm" aria-label="Peticiones pendientes">
          {carga.peticiones.map((peticion) => {
            return (
              <li
                key={peticion.id}
                onClick={() => seleccionarPeticion(peticion.id)}
                className="flex flex-col gap-3 p-5 cursor-pointer transition-colors hover:bg-gris-50 escritorio:flex-row escritorio:items-center escritorio:justify-between"
              >
                <div>
                  <h2 className="text-base font-bold text-tinta">
                    {peticion.procedimiento_nombre}
                  </h2>
                  <p className="mt-1 text-sm text-gris-700">
                    Alumno: <span className="font-semibold text-tinta">{peticion.alumno_nombre ?? `ID #${peticion.alumno_id}`}</span>
                    {peticion.alumno_matricula && ` (${peticion.alumno_matricula})`}
                    {" · "}
                  </p>
                  <p className="mt-1 text-sm text-gris-700">Solicitado el {formatearFecha(peticion.fecha_solicitud)}</p>
                  <p className="mt-0.5 text-xs text-gris-500">
                    Folio <span className="tabular-nums">#{peticion.id}</span>
                  </p>
                  <span className="text-sm font-semibold text-azul-texto underline escritorio:no-underline">
                    Atender y firmar →
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge estado={peticion.estado} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}