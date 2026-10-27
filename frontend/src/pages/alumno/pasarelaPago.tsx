import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { obtenerProcedimiento, Procedimiento } from "../../api/procedimientos"
import { confirmarPago, ConfirmacionPago } from "../../api/pasarela"
import { Alert, Button, LoadingScreen, StatusBadge } from "../../components"

type Carga =
  | { estado: 'cargando' }
  | { estado: 'error' }
  | { estado: 'listo'; procedimiento: Procedimiento };

interface PasarelaState {
  procedimiento?: Procedimiento;
}

const METODOS_PAGO = [
  {
    valor: 'Tarjeta de crédito o débito',
    descripcion: 'Pago inmediato simulado con tarjeta bancaria.',
  },
  {
    valor: 'Transferencia bancaria',
    descripcion: 'Se te mostrará la cuenta para completar la transferencia.',
  },
  {
    valor: 'Pago en OXXO',
    descripcion: 'Se generará una referencia para pagar en tienda.',
  },
];

const formatoCosto = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export default function PasarelaPago(): React.JSX.Element {
  const { procedimientoId } = useParams<{ procedimientoId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const id = Number(procedimientoId);

  const precargado = (location.state as PasarelaState | null)?.procedimiento;
  const [carga, setCarga] = useState<Carga>(() =>
    precargado && precargado.id === id
      ? { estado: 'listo', procedimiento: precargado }
      : { estado: 'cargando' }
  );
  const [metodoPago, setMetodoPago] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [confirmacion, setConfirmacion] = useState<ConfirmacionPago | null>(null);

  useEffect(() => {
    if (Number.isNaN(id)) {
      setCarga({ estado: 'error' });
      return;
    }

    if (precargado && precargado.id === id) {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (carga.estado !== 'listo' || metodoPago === '') {
      return;
    }

    setEnviando(true);
    setErrorEnvio('');

    try {
      const resultado = await confirmarPago(carga.procedimiento.id, metodoPago);
      setConfirmacion(resultado);
    } catch (error) {
      setErrorEnvio(error instanceof Error ? error.message : 'No se pudo procesar el pago del trámite.');
    } finally {
      setEnviando(false);
    }
  };

  const volverAlCatalogo = () => navigate('/dashboard/alumno/catalogo');

  if (confirmacion) {
    return <main className="mx-auto max-w-2xl px-4 py-8 escritorio:py-10">
        <section className="rounded bg-blanco p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-azul-texto">Solicitud registrada</h1>
            <StatusBadge estado={confirmacion.estado} />
          </div>
          <p className="mt-3 text-base text-tinta">
            Tu trámite fue registrado y el pago quedó pendiente de confirmación. Folio de la
            solicitud: <span className="font-semibold tabular-nums">#{confirmacion.peticion_id}</span>.
          </p>
          <dl className="mt-5 divide-y divide-gris-200 border-y border-gris-200">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-gris-700">Método de pago</dt>
              <dd className="text-sm font-semibold text-tinta">{metodoPago}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-gris-700">Monto</dt>
              <dd className="text-sm font-semibold tabular-nums text-tinta">
                {formatoCosto.format(confirmacion.monto)}
              </dd>
            </div>
          </dl>
          <Button className="mt-6" onClick={volverAlCatalogo}>
            Volver al catálogo
          </Button>
        </section>
      </main>;
  }

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

  const { procedimiento } = carga;

  return <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
      <div className="grid gap-6 escritorio:grid-cols-[1fr_1fr] escritorio:items-start">
        <section aria-labelledby="resumen-tramite" className="rounded bg-blanco p-6 shadow-sm">
          <h1 id="resumen-tramite" className="text-xl font-bold text-azul-texto">Resumen del trámite</h1>
          <h2 className="mt-4 text-lg font-bold text-tinta">{procedimiento.nombre}</h2>
          <p className="mt-2 text-base text-tinta">{procedimiento.descripcion}</p>
          <p className="mt-3 text-sm text-gris-700">
            Vigencia de {procedimiento.vigencia_meses} {procedimiento.vigencia_meses === 1 ? "mes" : "meses"}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-gris-200 pt-4">
            <span className="text-base font-semibold text-gris-700">Total a pagar</span>
            <span className="text-xl font-bold tabular-nums text-tinta">
              {formatoCosto.format(procedimiento.costo)}
            </span>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded bg-blanco p-6 shadow-sm" aria-busy={enviando}>
          <h2 className="text-xl font-bold text-azul-texto">Método de pago</h2>

          <Alert type="info" className="mt-4">
            Pasarela de pago simulada. No se realizará ningún cargo real.
          </Alert>

          <fieldset className="mt-5" disabled={enviando}>
            <legend className="text-sm font-semibold text-gris-700">Selecciona cómo deseas pagar</legend>
            <div className="mt-3 space-y-3">
              {METODOS_PAGO.map((metodo) => {
                const seleccionado = metodoPago === metodo.valor;

                return <label
                  key={metodo.valor}
                  className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors duration-150 ${
                    seleccionado
                      ? 'border-azul-institucional bg-azul-050'
                      : 'border-gris-300 bg-blanco hover:bg-gris-050'
                  }`}
                >
                  <input
                    type="radio"
                    name="metodo_pago"
                    value={metodo.valor}
                    checked={seleccionado}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="mt-1 h-4 w-4 accent-azul-institucional"
                    required
                  />
                  <span>
                    <span className="block text-base font-semibold text-tinta">{metodo.valor}</span>
                    <span className="mt-0.5 block text-sm text-gris-700">{metodo.descripcion}</span>
                  </span>
                </label>;
              })}
            </div>
          </fieldset>

          {errorEnvio !== '' && <Alert type="error" className="mt-4">
            {errorEnvio}
          </Alert>}

          <div className="mt-6 flex flex-col gap-3 escritorio:flex-row-reverse">
            <Button type="submit" fullWidth disabled={enviando || metodoPago === ''}>
              {enviando ? 'Procesando pago...' : 'Confirmar y solicitar'}
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={volverAlCatalogo} disabled={enviando}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </main>;
}
