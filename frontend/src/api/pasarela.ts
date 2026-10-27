import { POST } from './apiConnection';

export interface ConfirmacionPago {
  peticion_id: number;
  pago_id: number;
  estado: string;
  monto: number;
}

export async function confirmarPago(procedimientoId: number, metodoPago: string): Promise<ConfirmacionPago> {
  const res = await POST('/api/pasarela/confirmar', {
    procedimiento_id: procedimientoId,
    metodo_pago: metodoPago,
  });

  if (!res.ok) {
    let mensaje = 'No se pudo procesar el pago del trámite.';
    try {
      const data = await res.json();
      mensaje = data.mensaje ?? mensaje;
    } catch {
      // La respuesta no tuvo cuerpo JSON; se conserva el mensaje por omisión.
    }
    throw new Error(mensaje);
  }

  return res.json();
}
