import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
}) => {
  return (
    <div
      className={`flex flex-col gap-6 p-6 escritorio:flex-row escritorio:items-center escritorio:gap-10 transition duration-200 ${
        hoverable ? 'hover:shadow-md hover:border-gris-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
