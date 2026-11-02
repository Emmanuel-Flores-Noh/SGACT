import { useEffect, useState } from 'react';
import { obtenerProcedimiento } from '../api/procedimientos';
import type { Procedimiento } from '../api/procedimientos';

export type CargaProcedimiento =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'listo'; procedimiento: Procedimiento };

export function useProcedimiento(id: number): CargaProcedimiento {
  const [carga, setCarga] = useState<CargaProcedimiento>({ estado: 'cargando' });

  useEffect(() => {
    if (Number.isNaN(id)) {
      setCarga({ estado: 'error' });
      return;
    }

    let activo = true;
    setCarga({ estado: 'cargando' });

    obtenerProcedimiento(id)
      .then((procedimiento) => {
        if (activo) setCarga({ estado: 'listo', procedimiento });
      })
      .catch(() => {
        if (activo) setCarga({ estado: 'error' });
      });

    return () => {
      activo = false;
    };
  }, [id]);

  return carga;
}
