import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { confirmarPago, ConfirmacionPago, ErrorPago } from "../../api/pasarela"
import { useProcedimiento } from "../../hooks/useProcedimiento"
import { Alert, Button, LoadingScreen, PasosPasarela, ResumenProcedimiento, StatusBadge } from "../../components"
import {
  BANCOS,
  DATOS_PAGO_INICIALES,
  formatearNumeroTarjeta,
  formatearVencimiento,
  soloDigitos,
  validarDatosPago,
} from "../../utils/validacionPago"
import type { DatosPago, MetodoPagoId } from "../../utils/validacionPago"

const METODOS_PAGO: Array<{ id: MetodoPagoId; label: string; descripcion: string }> = [
  {
    id: 'tarjeta',
    label: 'Tarjeta de crédito o débito',
    descripcion: 'Pago inmediato simulado con tarjeta bancaria.',
  },
  {
    id: 'transferencia',
    label: 'Transferencia bancaria',
    descripcion: 'Proporciona los datos de la cuenta desde la que transferirás.',
  },
  {
    id: 'oxxo',
    label: 'Pago en OXXO',
    descripcion: 'Se generará una referencia para pagar en tienda.',
  },
];

const formatoCosto = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

const claseInput = (error?: string) =>
  `w-full rounded-sm border ${error ? 'border-err-600' : 'border-gris-300'} bg-blanco px-3.5 py-2.5 text-base text-tinta placeholder:text-gris-500 outline-none transition focus:border-azul-institucional focus:ring-1 focus:ring-azul-institucional`;

interface CampoTextoProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string;
  etiqueta: string;
  error?: string;
  ayuda?: string;
}

const CampoTexto: React.FC<CampoTextoProps> = ({
  id,
  etiqueta,
  error,
  ayuda,
  className = '',
  ...props
}) => {
  const descritoPor = error
    ? `${id}-error`
    : ayuda
      ? `${id}-ayuda`
      : undefined;

  return <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gris-700">{etiqueta}</label>
      <input
        id={id}
        className={`${claseInput(error)} mt-1.5 ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={descritoPor}
        {...props}
      />
      {error && <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-err-600">{error}</p>}
      {!error && ayuda && <p id={`${id}-ayuda`} className="mt-1 text-xs text-gris-500">{ayuda}</p>}
    </div>;
};

export default function PasarelaPago(): React.JSX.Element {
  const { procedimientoId } = useParams<{ procedimientoId: string }>();
  const navigate = useNavigate();
  const id = Number(procedimientoId);
  const carga = useProcedimiento(id);

  const [metodoPago, setMetodoPago] = useState<MetodoPagoId | ''>('');
  const [datos, setDatos] = useState<DatosPago>(DATOS_PAGO_INICIALES);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState('');
  const [confirmacion, setConfirmacion] = useState<ConfirmacionPago | null>(null);

  const actualizarCampo = (campo: keyof DatosPago, valor: string) => {
    setDatos((previos) => ({ ...previos, [campo]: valor }));
    setErrores((previos) => {
      if (!(campo in previos)) {
        return previos;
      }

      const copia = { ...previos };
      delete copia[campo];
      return copia;
    });
  };

  const seleccionarMetodo = (metodo: MetodoPagoId) => {
    setMetodoPago(metodo);
    setErrores({});
    setErrorEnvio('');
  };

  const enfocarPrimerError = (listaErrores: Record<string, string>) => {
    const primerCampo = Object.keys(listaErrores)[0];

    if (primerCampo === undefined) {
      return;
    }

    const idElemento = primerCampo === 'metodo_pago' ? 'metodo-tarjeta' : primerCampo;
    document.getElementById(idElemento)?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (carga.estado !== 'listo') {
      return;
    }

    if (metodoPago === '') {
      setErrores({ metodo_pago: 'Selecciona un método de pago.' });
      setErrorEnvio('Selecciona un método de pago para continuar.');
      enfocarPrimerError({ metodo_pago: 'Selecciona un método de pago.' });
      return;
    }

    const erroresCliente = validarDatosPago(metodoPago, datos);

    if (Object.keys(erroresCliente).length > 0) {
      setErrores(erroresCliente);
      setErrorEnvio('Revisa los campos marcados e inténtalo de nuevo.');
      enfocarPrimerError(erroresCliente);
      return;
    }

    setEnviando(true);
    setErrorEnvio('');
    setErrores({});

    try {
      const resultado = await confirmarPago(carga.procedimiento.id, metodoPago, datos);
      setConfirmacion(resultado);
    } catch (error) {
      if (error instanceof ErrorPago) {
        setErrores(error.errores);
        setErrorEnvio(error.message);
        enfocarPrimerError(error.errores);
      } else {
        setErrorEnvio(error instanceof Error ? error.message : 'No se pudo procesar el pago del trámite.');
      }
    } finally {
      setEnviando(false);
    }
  };

  const volverAlCatalogo = () => navigate('/dashboard/alumno/catalogo');
  const volverAlResumen = () => navigate(`/dashboard/alumno/pasarela/${id}`);
  const procedimientoActual = carga.estado === 'listo' ? carga.procedimiento : null;
  const etiquetaMetodo = METODOS_PAGO.find((metodo) => metodo.id === metodoPago)?.label ?? '';

  if (confirmacion) {
    return <main className="mx-auto max-w-4xl px-4 py-8 escritorio:py-10">
        <div className="grid gap-6 escritorio:grid-cols-[1fr_1fr] escritorio:items-start">
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
                <dd className="text-sm font-semibold text-tinta">{etiquetaMetodo}</dd>
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

          {procedimientoActual && <ResumenProcedimiento procedimiento={procedimientoActual} />}
        </div>
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

  return <main className="mx-auto max-w-2xl px-4 py-8 escritorio:py-10">
      <PasosPasarela paso={2} />

      <form onSubmit={handleSubmit} className="mt-6 rounded bg-blanco p-6 shadow-sm" aria-busy={enviando} noValidate>
          <h1 className="text-xl font-bold text-azul-texto">Método de pago</h1>
          <p className="mt-1 text-sm text-gris-700">
            Trámite: <span className="font-semibold text-tinta">{procedimiento.nombre}</span>
          </p>

          <Alert type="info" className="mt-4">
            Pasarela de pago simulada. No se realizará ningún cargo real.
          </Alert>

          <fieldset
            className="mt-5"
            disabled={enviando}
            aria-describedby={errores.metodo_pago ? 'metodo_pago-error' : undefined}
          >
            <legend className="text-sm font-semibold text-gris-700">Selecciona cómo deseas pagar</legend>
            <div className="mt-3 space-y-3">
              {METODOS_PAGO.map((metodo) => {
                const seleccionado = metodoPago === metodo.id;

                return <label
                  key={metodo.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors duration-150 ${
                    seleccionado
                      ? 'border-azul-institucional bg-azul-050'
                      : 'border-gris-300 bg-blanco hover:bg-gris-050'
                  }`}
                >
                  <input
                    id={`metodo-${metodo.id}`}
                    type="radio"
                    name="metodo_pago"
                    value={metodo.id}
                    checked={seleccionado}
                    onChange={() => seleccionarMetodo(metodo.id)}
                    className="mt-1 h-4 w-4 accent-azul-institucional"
                  />
                  <span>
                    <span className="block text-base font-semibold text-tinta">{metodo.label}</span>
                    <span className="mt-0.5 block text-sm text-gris-700">{metodo.descripcion}</span>
                  </span>
                </label>;
              })}
            </div>
            {errores.metodo_pago && <p id="metodo_pago-error" className="mt-2 text-sm font-semibold text-err-600">
              {errores.metodo_pago}
            </p>}
          </fieldset>

          {metodoPago !== '' && <div className="mt-5 border-t border-gris-200 pt-5">
            <h3 className="text-base font-bold text-tinta">Datos de pago</h3>

            <div className="mt-3 space-y-4">
              {metodoPago === 'tarjeta' && <>
                <CampoTexto
                  id="titular_tarjeta"
                  etiqueta="Titular de la tarjeta"
                  value={datos.titular_tarjeta}
                  onChange={(e) => actualizarCampo('titular_tarjeta', e.target.value)}
                  error={errores.titular_tarjeta}
                  placeholder="Como aparece en la tarjeta"
                  autoComplete="cc-name"
                  maxLength={80}
                  disabled={enviando}
                />
                <CampoTexto
                  id="numero_tarjeta"
                  etiqueta="Número de tarjeta"
                  value={datos.numero_tarjeta}
                  onChange={(e) => actualizarCampo('numero_tarjeta', formatearNumeroTarjeta(e.target.value))}
                  error={errores.numero_tarjeta}
                  ayuda="Simulación: puedes usar 4242 4242 4242 4242."
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  maxLength={23}
                  disabled={enviando}
                />
                <div className="grid grid-cols-2 gap-4">
                  <CampoTexto
                    id="vencimiento"
                    etiqueta="Vencimiento"
                    value={datos.vencimiento}
                    onChange={(e) => actualizarCampo('vencimiento', formatearVencimiento(e.target.value))}
                    error={errores.vencimiento}
                    placeholder="MM/AA"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={5}
                    disabled={enviando}
                  />
                  <CampoTexto
                    id="cvv"
                    etiqueta="CVV"
                    type="password"
                    value={datos.cvv}
                    onChange={(e) => actualizarCampo('cvv', soloDigitos(e.target.value, 4))}
                    error={errores.cvv}
                    ayuda="3 o 4 dígitos."
                    placeholder="123"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    disabled={enviando}
                  />
                </div>
              </>}

              {metodoPago === 'transferencia' && <>
                <div>
                  <label htmlFor="banco" className="block text-sm font-semibold text-gris-700">Banco de origen</label>
                  <select
                    id="banco"
                    value={datos.banco}
                    onChange={(e) => actualizarCampo('banco', e.target.value)}
                    className={`${claseInput(errores.banco)} mt-1.5`}
                    aria-invalid={errores.banco ? true : undefined}
                    aria-describedby={errores.banco ? 'banco-error' : undefined}
                    disabled={enviando}
                  >
                    <option value="">Selecciona tu banco</option>
                    {BANCOS.map((banco) => <option key={banco} value={banco}>{banco}</option>)}
                  </select>
                  {errores.banco && <p id="banco-error" className="mt-1 text-sm font-semibold text-err-600">{errores.banco}</p>}
                </div>
                <CampoTexto
                  id="titular_cuenta"
                  etiqueta="Titular de la cuenta"
                  value={datos.titular_cuenta}
                  onChange={(e) => actualizarCampo('titular_cuenta', e.target.value)}
                  error={errores.titular_cuenta}
                  placeholder="Nombre completo"
                  autoComplete="name"
                  maxLength={80}
                  disabled={enviando}
                />
                <CampoTexto
                  id="clabe"
                  etiqueta="CLABE interbancaria"
                  value={datos.clabe}
                  onChange={(e) => actualizarCampo('clabe', soloDigitos(e.target.value, 18))}
                  error={errores.clabe}
                  ayuda="18 dígitos."
                  placeholder="000000000000000000"
                  inputMode="numeric"
                  maxLength={18}
                  disabled={enviando}
                />
              </>}

              {metodoPago === 'oxxo' && <>
                <CampoTexto
                  id="nombre_pagador"
                  etiqueta="Nombre de quien paga"
                  value={datos.nombre_pagador}
                  onChange={(e) => actualizarCampo('nombre_pagador', e.target.value)}
                  error={errores.nombre_pagador}
                  placeholder="Nombre completo"
                  autoComplete="name"
                  maxLength={80}
                  disabled={enviando}
                />
                <CampoTexto
                  id="telefono"
                  etiqueta="Teléfono de contacto"
                  type="tel"
                  value={datos.telefono}
                  onChange={(e) => actualizarCampo('telefono', soloDigitos(e.target.value, 10))}
                  error={errores.telefono}
                  ayuda="10 dígitos."
                  placeholder="9991234567"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  disabled={enviando}
                />
              </>}
            </div>
          </div>}

          {errorEnvio !== '' && <Alert type="error" className="mt-4">
            {errorEnvio}
          </Alert>}

          <div className="mt-6 flex items-center justify-between border-t border-gris-200 pt-4">
            <span className="text-base font-semibold text-gris-700">Total a pagar</span>
            <span className="text-xl font-bold tabular-nums text-tinta">
              {formatoCosto.format(procedimiento.costo)}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button type="submit" fullWidth disabled={enviando || metodoPago === ''}>
              {enviando ? 'Procesando pago...' : 'Confirmar y solicitar'}
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={volverAlResumen} disabled={enviando}>
              Volver al resumen
            </Button>
            <Button type="button" variant="secondary" fullWidth onClick={volverAlCatalogo} disabled={enviando}>
              Cancelar
            </Button>
          </div>
        </form>
    </main>;
}
