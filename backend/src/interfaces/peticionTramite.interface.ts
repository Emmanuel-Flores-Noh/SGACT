export type EstadoPeticion =
  | 'En confirmación de pago'
  | 'En trámite'
  | 'Finalizado'
  | 'Archivado'
  | string;

export interface IPeticionTramite {
  id: number;
  alumno_id: number;
  procedimiento_id: number;
  estado: EstadoPeticion;
  fecha_solicitud: string;
}
