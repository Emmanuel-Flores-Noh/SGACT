import React, { useId } from 'react';
import type { Procedimiento } from '../../api/procedimientos';

export interface ResumenProcedimientoProps {
  procedimiento: Procedimiento;
  className?: string;
}

const formatoCosto = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

/**
 * Resumen del trámite elegido: nombre, costo y vigencia.
 * Se usa antes de pagar y después de registrar la solicitud.
 */
export const ResumenProcedimiento: React.FC<ResumenProcedimientoProps> = ({
  procedimiento,
  className = '',
}) => {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`rounded bg-blanco p-6 shadow-sm ${className}`}
    >
      <h2 id={headingId} className="text-xl font-bold text-azul-texto">Resumen del trámite</h2>
      <h3 className="mt-4 text-lg font-bold text-tinta">{procedimiento.nombre}</h3>
      <p className="mt-2 text-base text-tinta">{procedimiento.descripcion}</p>

      <dl className="mt-5 divide-y divide-gris-200 border-t border-gris-200">
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="text-sm text-gris-700">Costo</dt>
          <dd className="text-lg font-bold tabular-nums text-tinta">
            {formatoCosto.format(procedimiento.costo)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 py-3">
          <dt className="text-sm text-gris-700">Vigencia</dt>
          <dd className="text-sm font-semibold text-tinta">
            {procedimiento.vigencia_meses} {procedimiento.vigencia_meses === 1 ? "mes" : "meses"}
          </dd>
        </div>
      </dl>
    </section>
  );
};
