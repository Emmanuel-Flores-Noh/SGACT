import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-sm transition duration-150 outline-none focus-visible:ring-2 focus-visible:ring-azul-institucional focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gris-100 disabled:text-gris-500 disabled:border-gris-200';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-base',
  }[size];

  const variantStyles = {
    primary:
      'rounded-sm bg-azul-institucional px-6 py-2.5 text-base font-semibold text-blanco transition-colors duration-150 hover:bg-azul-institucional-enfoque active:bg-azul-institucional-enfoque focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azul-institucional focus-visible:ring-offset-2',
    secondary:
      'bg-gris-100 text-gris-700 hover:bg-gris-200 active:bg-gris-300',
    outline:
      'border border-gris-300 bg-blanco text-tinta hover:bg-gris-050 active:bg-gris-100',
    danger:
      'bg-err-600 text-blanco hover:opacity-90 active:opacity-95 shadow-sm',
  }[variant];

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
