import { GET, PUT } from './apiConnection';

export interface PeticionTramite {
  id: number;
  alumno_id: number;
  procedimiento_id: number;
  estado: string;
  fecha_solicitud: string;
  nombre_tramite?: string | null;
}

export async function obtenerPeticionesAlumno(): Promise<PeticionTramite[]> {
  const res = await GET('/api/peticiones/');

  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener las peticiones`);
  }

  return res.json();
}

/**
 * Descarga la constancia firmada de un trámite "Finalizado" como `constancia-<id>.pdf`.
 * Si el backend la rechaza (otro alumno, archivado, sin firma…) lanza un Error con su mensaje.
 */
export async function descargarConstancia(peticionId: number): Promise<void> {
  const res = await GET(`/api/peticiones/${peticionId}/documento`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.mensaje || 'No se pudo descargar la constancia');
  }

  const url = URL.createObjectURL(await res.blob());
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `constancia-${peticionId}.pdf`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  // Se libera después del clic: algunos navegadores leen la URL de forma asíncrona
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function actualizarEstadoPeticion(peticionId: number, estado: string, firmaId?: number) {
    const res = await PUT(`/api/peticiones/${peticionId}/estado`, {
        estado_nuevo: estado,
        firma_id: firmaId
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.mensaje || "Error al actualizar el estado de la petición");
    }

    return res.json();
}
