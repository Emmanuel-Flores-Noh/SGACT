import React, { useEffect, useState } from "react";
import { getUserData } from "../../api/usuario";
import { obtenerHistorialPeticiones, HistorialPeticion } from "../../api/historial";
import { Button, LoadingScreen, StatusBadge } from "../../components";
import { IoChevronDown, IoChevronUp, IoTimeOutline } from "react-icons/io5";

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'listo'; peticionesAgrupadas: PeticionAgrupada[] };

interface PeticionAgrupada {
  peticion_id: number;
  procedimiento: string;
  nombre_alumno: string;
  matricula_alumno: string;
  fecha_solicitud: string;
  fecha_ultimo_cambio: string; // <--- Añadido para ordenar por el movimiento más reciente
  estado_actual: string;
  bitacora: HistorialPeticion[];
}

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

export default function HistorialRevisor(): React.JSX.Element {
  const [carga, setCarga] = useState<Carga>({ estado: 'cargando' });
  const [peticionExpandidaId, setPeticionExpandidaId] = useState<number | null>(null);

  const cargar = async () => {
    setCarga({ estado: 'cargando' });

    try {
      const respuestaUsuario = await getUserData();
      if (!respuestaUsuario.ok) {
        throw new Error('No se pudo obtener el usuario');
      }

      const historialRaw = await obtenerHistorialPeticiones();

      // Agrupar los registros planos por peticion_id
      const mapaPeticiones = new Map<number, HistorialPeticion[]>();
      
      for (const item of (historialRaw || [])) {
        if (!mapaPeticiones.has(item.peticion_id)) {
          mapaPeticiones.set(item.peticion_id, []);
        }
        mapaPeticiones.get(item.peticion_id)!.push(item);
      }

      // Construir la lista consolidada de peticiones únicas
      const peticionesAgrupadas: PeticionAgrupada[] = [];

      mapaPeticiones.forEach((estados, peticion_id) => {
        // Ordenar los estados internos cronológicamente por fecha ascendente
        const estadosOrdenados = estados.sort((a, b) => {
          return new Date(a.fecha.replace(' ', 'T')).getTime() - new Date(b.fecha.replace(' ', 'T')).getTime();
        });

        const primerEstado = estadosOrdenados[0];
        const ultimoEstado = estadosOrdenados[estadosOrdenados.length - 1];

        peticionesAgrupadas.push({
          peticion_id,
          procedimiento: primerEstado.procedimiento || "Trámite",
          nombre_alumno: primerEstado.nombre_alumno || "Estudiante",
          matricula_alumno: primerEstado.matricula_alumno || "",
          fecha_solicitud: primerEstado.fecha,
          fecha_ultimo_cambio: ultimoEstado.fecha, // <--- Guardamos la fecha de la última actualización
          estado_actual: ultimoEstado.estado,
          bitacora: estadosOrdenados,
        });
      });

      // Ordenar las peticiones generales de la MÁS RECIENTE a la MÁS ANTIGUA
      // basándose en la fecha del último estado o actualización
      peticionesAgrupadas.sort((a, b) => {
        const tiempoA = new Date(a.fecha_ultimo_cambio.replace(' ', 'T')).getTime();
        const tiempoB = new Date(b.fecha_ultimo_cambio.replace(' ', 'T')).getTime();
        return tiempoB - tiempoA; // <--- Orden descendiente (más reciente primero)
      });

      setCarga({ estado: 'listo', peticionesAgrupadas });
    } catch (error) {
      console.error("Error al cargar historial general:", error);
      setCarga({ estado: 'error' });
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const toggleExpandir = (peticionId: number) => {
    setPeticionExpandidaId(peticionExpandidaId === peticionId ? null : peticionId);
  };

  if (carga.estado === 'cargando') {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
        <LoadingScreen fullScreen={false} mensaje="Cargando historial general..." />
      </main>
    );
  }

  if (carga.estado === 'error') {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
        <div className="rounded bg-blanco p-6 shadow-sm">
          <h1 className="text-xl font-bold text-azul-texto">Historial General</h1>
          <p className="mt-3 text-base font-semibold text-tinta">No se pudo cargar el historial general.</p>
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
      <h1 className="text-xl font-bold text-azul-texto">Historial General de Peticiones</h1>
      <p className="mt-1 text-base text-gris-700">Consulta todas las solicitudes del sistema y su trazabilidad de cambios.</p>

      {carga.peticionesAgrupadas.length === 0 ? (
        <div className="mt-6 rounded bg-blanco p-6 shadow-sm">
          <p className="text-base font-semibold text-tinta">No hay peticiones registradas.</p>
          <p className="mt-1 text-base text-gris-700">Aún no existen solicitudes en el sistema.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4" aria-label="Historial de peticiones">
          {carga.peticionesAgrupadas.map((peticion) => {
            const estaExpandido = peticionExpandidaId === peticion.peticion_id;

            return (
              <div
                key={peticion.peticion_id}
                className="bg-blanco rounded border border-gris-200 shadow-sm overflow-hidden transition-all"
              >
                {/* Datos generales de la petición con su estado más reciente */}
                <div
                  onClick={() => toggleExpandir(peticion.peticion_id)}
                  className="p-5 flex flex-col gap-3 cursor-pointer hover:bg-gris-050 escritorio:flex-row escritorio:items-center escritorio:justify-between"
                >
                  <div>
                    <h2 className="text-base font-bold text-tinta">
                      {peticion.procedimiento}
                    </h2>
                    <p className="mt-1 text-sm text-gris-700">
                      Alumno: <span className="font-semibold text-tinta">{peticion.nombre_alumno}</span>
                      {peticion.matricula_alumno && ` (${peticion.matricula_alumno})`}
                      {" · "}
                    </p>
                    <p className="mt-1 text-sm text-gris-700">Solicitado el {formatearFecha(peticion.fecha_solicitud)}</p>
                    <p className="mt-0.5 text-xs text-gris-500">
                      Folio <span className="tabular-nums">#{peticion.peticion_id}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge estado={peticion.estado_actual} />
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-semibold text-azul-institucional hover:underline"
                    >
                      {estaExpandido ? <IoChevronUp className="w-4 h-4" /> : <IoChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Desplegable con la bitácora completa construida localmente */}
                {estaExpandido && (
                  <div className="bg-gris-050 border-t border-gris-200 p-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gris-700 mb-3 flex items-center gap-1.5">
                      <IoTimeOutline className="w-4 h-4 text-azul-institucional" />
                      <span>Historial detallado ({peticion.bitacora.length} registros)</span>
                    </h3>

                    <ul className="relative border-l border-gris-300 ml-2 space-y-4 py-1">
                      {peticion.bitacora.map((h, idx) => (
                        <li key={idx} className="ml-4 relative">
                          <span className="absolute -left-[23px] top-1 h-2.5 w-2.5 rounded-full bg-azul-institucional ring-4 ring-gris-050" />
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <div>
                              <span className="text-xs font-semibold text-tinta block">
                                Estado: <StatusBadge estado={h.estado} />
                              </span>
                            </div>
                            <span className="text-[11px] text-gris-500 font-mono">
                              {formatearFecha(h.fecha)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}