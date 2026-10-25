export interface Procedimiento {
  id: number;
  nombre: string;
  descripcion: string;
  costo: number;
  vigencia_meses: number;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export async function obtenerProcedimientos(): Promise<Procedimiento[]> {
  const res = await fetch(`${API_URL}/api/procedimientos`, { credentials: 'include' });

  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener el catálogo`);
  }

  return res.json();
}
