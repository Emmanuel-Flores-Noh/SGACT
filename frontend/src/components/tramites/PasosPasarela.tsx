import React from 'react';

export interface PasosPasarelaProps {
  paso: 1 | 2;
}

const pasos = [
  { numero: 1, etiqueta: 'Resumen' },
  { numero: 2, etiqueta: 'Pago' },
] as const;

export const PasosPasarela: React.FC<PasosPasarelaProps> = ({ paso }) => {
  return <ol className="flex items-center gap-3" aria-label="Progreso de la solicitud">
      {pasos.map((item, indice) => {
        const activo = item.numero === paso;
        const completado = item.numero < paso;

        return <React.Fragment key={item.numero}>
            {indice > 0 && <li aria-hidden="true" className="h-px flex-1 bg-gris-200" />}
            <li
              aria-current={activo ? 'step' : undefined}
              className="flex items-center gap-2"
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                  activo
                    ? 'bg-azul-institucional text-blanco'
                    : completado
                      ? 'bg-azul-050 text-azul-600'
                      : 'bg-gris-100 text-gris-500'
                }`}
              >
                {item.numero}
              </span>
              <span className={`text-sm ${activo ? 'font-semibold text-tinta' : 'text-gris-700'}`}>
                {item.etiqueta}
              </span>
            </li>
          </React.Fragment>;
      })}
    </ol>;
};
