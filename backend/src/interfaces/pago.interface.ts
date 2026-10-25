export type EstadoPago = 'pendiente' | 'completado' | 'fallido' | string;

export interface IPago {
  id: number;
  peticion_id: number;
  metodo_pago: string;
  monto: number;
  estado_pago: EstadoPago;
  fecha: string;
}
