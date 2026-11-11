import React from 'react';

export type EstadoTramite =
  | 'En confirmación de pago'
  | 'En trámite'
  | 'Finalizado'
  | 'Archivado'
  | 'Atención'
  | 'Rechazado'
  | string;

/** Roles de color de estado definidos en el skill de identidad (§4) */
type RolEstado = 'exito' | 'error' | 'sin-veredicto' | 'atencion' | 'inactivo';

const CLASES_ROL: Record<RolEstado, { fondo: string; texto: string; borde: string; punto: string }> = {
  exito: { fondo: 'bg-ok-050', texto: 'text-ok-600', borde: 'border-ok-200', punto: 'bg-ok-600' },
  error: { fondo: 'bg-err-050', texto: 'text-err-600', borde: 'border-err-200', punto: 'bg-err-600' },
  'sin-veredicto': { fondo: 'bg-azul-050', texto: 'text-azul-600', borde: 'border-azul-200', punto: 'bg-azul-600' },
  atencion: { fondo: 'bg-warn-050', texto: 'text-warn-600', borde: 'border-warn-200', punto: 'bg-warn-600' },
  inactivo: { fondo: 'bg-gris-100', texto: 'text-gris-500', borde: 'border-gris-200', punto: 'bg-gris-500' },
};

/**
 * Único mapeo del frontend entre un estado del backend y su rol de color.
 * Las llaves van normalizadas (minúsculas y sin acentos); `etiqueta` es el texto que se muestra.
 */
const ESTADOS: Record<string, { rol: RolEstado; etiqueta: string }> = {
  'finalizado': { rol: 'exito', etiqueta: 'Finalizado' },
  'en tramite': { rol: 'sin-veredicto', etiqueta: 'En trámite' },
  'en confirmacion de pago': { rol: 'sin-veredicto', etiqueta: 'En confirmación de pago' },
  'archivado': { rol: 'inactivo', etiqueta: 'Archivado' },
  'atencion': { rol: 'atencion', etiqueta: 'Atención' },
  'rechazado': { rol: 'error', etiqueta: 'Rechazado' },
  'error': { rol: 'error', etiqueta: 'Rechazado' },
};

function normalizar(estado: string): string {
  return estado.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export interface BadgeProps {
  estado: EstadoTramite;
  /** Texto personalizado si se desea mostrar algo diferente al nombre del estado */
  label?: string;
  className?: string;
}

/**
 * Distintivo de estado de un trámite: siempre color **y** texto.
 * Un estado desconocido se muestra en gris neutro con su texto original.
 */
export const Badge: React.FC<BadgeProps> = ({ estado, label, className = '' }) => {
  const config = ESTADOS[normalizar(estado)];
  const clases = config
    ? CLASES_ROL[config.rol]
    : { fondo: 'bg-gris-100', texto: 'text-gris-700', borde: 'border-gris-200', punto: 'bg-gris-500' };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-xs font-semibold uppercase tracking-wider ${clases.fondo} ${clases.texto} ${clases.borde} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${clases.punto}`} aria-hidden="true" />
      {label || config?.etiqueta || estado}
    </span>
  );
};
