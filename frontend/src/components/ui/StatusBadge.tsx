import React from 'react';

export type EstadoTramite =
  | 'En confirmación de pago'
  | 'En trámite'
  | 'Finalizado'
  | 'Archivado'
  | 'Atención'
  | 'Rechazado'
  | string;

export interface StatusBadgeProps {
  estado: EstadoTramite;
  /** Texto personalizado si se desea mostrar algo diferente al nombre crudo del estado */
  label?: string;
  className?: string;
}

/**
 * Badge de estado según la especificación de identidad SGACT:
 * - "Finalizado" -> Éxito (ok-600 / ok-050 / ok-200)
 * - "En confirmación de pago" / "En trámite" -> Sin veredicto (azul-600 / azul-050 / azul-200)
 * - "Archivado" -> Inactivo (gris-500 / gris-100 / gris-200)
 * - "Atención" -> Plazo próximo (warn-600 / warn-050 / warn-200)
 * - "Rechazado" -> Error (err-600 / err-050 / err-200)
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  estado,
  label,
  className = '',
}) => {
  const getBadgeConfig = (est: string) => {
    switch (est.toLowerCase()) {
      case 'finalizado':
        return {
          bg: 'bg-ok-050',
          text: 'text-ok-600',
          border: 'border-ok-200',
          dot: 'bg-ok-600',
          textDisplay: label || 'Finalizado',
        };
      case 'en trámite':
      case 'en tramite':
        return {
          bg: 'bg-azul-050',
          text: 'text-azul-600',
          border: 'border-azul-200',
          dot: 'bg-azul-600',
          textDisplay: label || 'En trámite',
        };
      case 'en confirmación de pago':
      case 'en confirmacion de pago':
        return {
          bg: 'bg-azul-050',
          text: 'text-azul-600',
          border: 'border-azul-200',
          dot: 'bg-azul-600',
          textDisplay: label || 'En confirmación de pago',
        };
      case 'archivado':
        return {
          bg: 'bg-gris-100',
          text: 'text-gris-500',
          border: 'border-gris-200',
          dot: 'bg-gris-500',
          textDisplay: label || 'Archivado',
        };
      case 'atención':
      case 'atencion':
        return {
          bg: 'bg-warn-050',
          text: 'text-warn-600',
          border: 'border-warn-200',
          dot: 'bg-warn-600',
          textDisplay: label || 'Atención',
        };
      case 'rechazado':
      case 'error':
        return {
          bg: 'bg-err-050',
          text: 'text-err-600',
          border: 'border-err-200',
          dot: 'bg-err-600',
          textDisplay: label || 'Rechazado',
        };
      default:
        return {
          bg: 'bg-gris-100',
          text: 'text-gris-700',
          border: 'border-gris-200',
          dot: 'bg-gris-500',
          textDisplay: label || estado,
        };
    }
  };

  const config = getBadgeConfig(estado);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-xs font-semibold uppercase tracking-wider ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.textDisplay}
    </span>
  );
};
