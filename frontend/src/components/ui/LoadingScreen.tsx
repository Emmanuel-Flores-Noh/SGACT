import React from 'react';

export interface LoadingScreenProps {
  /** Mensaje opcional debajo del indicador de carga */
  mensaje?: string;
  /** Tamaño del spinner en píxeles ('sm', 'md', 'lg') */
  size?: 'sm' | 'md' | 'lg';
  /** Si es true, ocupa toda la pantalla (h-screen/fixed). Si es false, se ajusta a su contenedor (min-h-[200px]) */
  fullScreen?: boolean;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  mensaje = undefined,
  size = 'md',
  fullScreen = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const containerLayout = fullScreen
    ? 'min-h-screen fixed inset-0 z-50'
    : 'min-h-[250px] w-full';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center bg-blanco text-tinta font-sgact ${containerLayout} ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-gris-200 border-t-azul-institucional ${sizeMap[size]}`}
      />

      {mensaje && (
        <p className="mt-4 text-sm font-semibold text-gris-700 tracking-wide animate-pulse">
          {mensaje}
        </p>
      )}

    </div>
  );
};
