import { GET } from './apiConnection';

export interface HistorialPeticion {
  id: number;
  peticion_id: number;
  procedimiento: string;
  nombre_alumno: string;
  matricula_alumno: string;
  estado: string;
  fecha: string;
}
export interface HistorialEstado{
  id: number;
  peticion_id: number;
  estado_anterior: string;
  estado_nuevo: string;
  fecha: string;
}

export async function obtenerHistorialPeticion(peticionId: number): Promise<HistorialEstado[]> {
  const res = await GET(`/api/historial/${peticionId}`);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener el historial de la petición`);
  }
  return res.json();
}

export async function obtenerHistorialPeticiones(): Promise<HistorialPeticion[]> {
  const res = await GET(`/api/historial/`);
  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener el historial general`);
  }
  return res.json();
}