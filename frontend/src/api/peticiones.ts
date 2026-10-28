import { GET } from './apiConnection';

export interface PeticionTramite {
  id: number;
  alumno_id: number;
  procedimiento_id: number;
  estado: string;
  fecha_solicitud: string;
}

export async function obtenerPeticionesAlumno(alumnoId: number): Promise<PeticionTramite[]> {
  const res = await GET(`/api/peticiones/alumno/${alumnoId}`);

  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener las peticiones del alumno`);
  }

  return res.json();
}
