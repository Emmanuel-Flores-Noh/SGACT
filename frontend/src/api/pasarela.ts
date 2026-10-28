import { POST } from './apiConnection';
import { construirDatosPago } from '../utils/validacionPago';
import type { DatosPago, MetodoPagoId } from '../utils/validacionPago';

export interface ConfirmacionPago {
  peticion_id: number;
  pago_id: number;
  estado: string;
  monto: number;
}

export class ErrorPago extends Error {
  errores: Record<string, string>;

  constructor(mensaje: string, errores: Record<string, string> = {}) {
    super(mensaje);
    this.name = 'ErrorPago';
    this.errores = errores;
  }
}

export async function confirmarPago(
  procedimientoId: number,
  metodoPago: MetodoPagoId,
  datosPago: DatosPago
): Promise<ConfirmacionPago> {
  const res = await POST('/api/pasarela/confirmar', {
    procedimiento_id: procedimientoId,
    metodo_pago: metodoPago,
    datos_pago: construirDatosPago(metodoPago, datosPago),
  });

  if (!res.ok) {
    let mensaje = 'No se pudo procesar el pago del trámite.';
    let errores: Record<string, string> = {};

    try {
      const data = await res.json();
      mensaje = data.mensaje ?? mensaje;
      errores = data.errores ?? {};
    } catch {
      // La respuesta no tuvo cuerpo JSON; se conserva el mensaje por omisión.
    }

    throw new ErrorPago(mensaje, errores);
  }

  return res.json();
}
