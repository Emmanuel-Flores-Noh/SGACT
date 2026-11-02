import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useProcedimiento } from "../../hooks/useProcedimiento"
import { Button, LoadingScreen, PasosPasarela, ResumenProcedimiento } from "../../components"

export default function PasarelaResumen(): React.JSX.Element {
  const { procedimientoId } = useParams<{ procedimientoId: string }>();
  const navigate = useNavigate();
  const id = Number(procedimientoId);
  const carga = useProcedimiento(id);

  const volverAlCatalogo = () => navigate('/dashboard/alumno/catalogo');
  const continuarAlPago = () => navigate(`/dashboard/alumno/pasarela/${id}/pago`);

  if (carga.estado === 'error') {
    return <main className="mx-auto max-w-2xl px-4 py-8 escritorio:py-10">
        <div className="rounded bg-blanco p-6 shadow-sm">
          <p className="text-base font-semibold text-tinta">No se pudo cargar el trámite seleccionado.</p>
          <p className="mt-1 text-base text-gris-700">Regresa al catálogo e inténtalo de nuevo.</p>
          <Button className="mt-4" onClick={volverAlCatalogo}>
            Volver al catálogo
          </Button>
        </div>
      </main>;
  }

  if (carga.estado === 'cargando') {
    return <main className="mx-auto max-w-2xl px-4 py-8 escritorio:py-10">
        <LoadingScreen fullScreen={false} mensaje="Cargando el trámite..." />
      </main>;
  }

  return <main className="mx-auto max-w-2xl px-4 py-8 escritorio:py-10">
      <h1 className="sr-only">Solicitar trámite</h1>
      <PasosPasarela paso={1} />

      <div className="mt-6">
        <ResumenProcedimiento procedimiento={carga.procedimiento} />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button fullWidth onClick={continuarAlPago}>
          Continuar al pago
        </Button>
        <Button variant="outline" fullWidth onClick={volverAlCatalogo}>
          Cancelar
        </Button>
      </div>
    </main>;
}
