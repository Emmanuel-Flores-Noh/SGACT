import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export interface CardProcedimientoProps {
  id: number;
  nombre: string;
  descripcion: string;
  costo: number;
  vigenciaMeses: number;
  onSolicitar: () => void;
  disabled?: boolean;
}

const formatoCosto = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export const CardProcedimiento: React.FC<CardProcedimientoProps> = ({
  id,
  nombre,
  descripcion,
  costo,
  vigenciaMeses,
  onSolicitar,
  disabled = false,
}) => { 
    
  return <Card>
              <div className="flex-1">
                <h2 id={`tramite-${id}`} className="text-xl font-bold text-azul-texto">
                  {nombre}
                </h2>
                <p className="mt-2 max-w-prose text-base text-tinta">
                  {descripcion}
                </p>
                <p className="mt-3 text-sm text-gris-700">
                  Vigencia de {vigenciaMeses} {vigenciaMeses === 1 ? "mes" : "meses"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-6 escritorio:flex-col escritorio:items-end escritorio:gap-3">
                <p className="text-xl font-bold tabular-nums text-tinta">
                  {formatoCosto.format(costo)}
                </p>
                <Button
                  onClick={onSolicitar}
                  aria-describedby={`tramite-${id}`}
                  disabled={disabled}
                >
                  Solicitar
                </Button>
              </div>
        </ Card>
};
