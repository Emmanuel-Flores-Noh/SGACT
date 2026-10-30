import { GET } from './apiConnection';

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
