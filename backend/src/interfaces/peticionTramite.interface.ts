export const ESTADO_EN_CONFIRMACION_DE_PAGO = 'En confirmación de pago';

export type EstadoPeticion =
  | typeof ESTADO_EN_CONFIRMACION_DE_PAGO
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
