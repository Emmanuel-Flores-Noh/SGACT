import { GET, PUT } from './apiConnection';

export interface PeticionTramite {
  id: number;
  alumno_id: number;
  procedimiento_id: number;
  estado: string;
  fecha_solicitud: string;
}

export async function obtenerPeticionesAlumno(): Promise<PeticionTramite[]> {
  const res = await GET('/api/peticiones/');

  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener las peticiones`);
  }

  return res.json();
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
