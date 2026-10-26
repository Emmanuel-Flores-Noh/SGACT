import React from 'react';

export interface AlertProps {
  type?: 'error' | 'warning' | 'success' | 'info';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Alerta del sistema SGACT.
 * Cumple contraste AA con texto oscuro/fuerte sobre fondo suave.
 */
export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
}) => {
  const styles = {
    error: {
      container: 'bg-err-050 border-err-200 text-err-600',
      title: 'text-err-600',
    },
    warning: {
      container: 'bg-warn-050 border-warn-200 text-warn-600',
      title: 'text-warn-600',
    },
    success: {
      container: 'bg-ok-050 border-ok-200 text-ok-600',
      title: 'text-ok-600',
    },
    info: {
      container: 'bg-azul-050 border-azul-200 text-azul-600',
      title: 'text-azul-600',
    },
  }[type];

  return (
    <div
      role="alert"
      className={`rounded-sm border p-3.5 text-sm ${styles.container} ${className}`}
    >
      {title && <h4 className={`font-bold mb-1 ${styles.title}`}>{title}</h4>}
      <div className="font-normal">{children}</div>
    </div>
  );
};
