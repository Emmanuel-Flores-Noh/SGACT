export type MetodoPagoId = 'tarjeta' | 'transferencia' | 'oxxo';

export interface DatosPago {
  titular_tarjeta: string;
  numero_tarjeta: string;
  vencimiento: string;
  cvv: string;
  banco: string;
  titular_cuenta: string;
  clabe: string;
  nombre_pagador: string;
  telefono: string;
}

export const DATOS_PAGO_INICIALES: DatosPago = {
  titular_tarjeta: '',
  numero_tarjeta: '',
  vencimiento: '',
  cvv: '',
  banco: '',
  titular_cuenta: '',
  clabe: '',
  nombre_pagador: '',
  telefono: '',
};

export const BANCOS = [
  'BBVA',
  'Banorte',
  'Santander',
  'HSBC',
  'Banamex',
  'Scotiabank',
  'Inbursa',
  'Otro',
];

const NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]{3,80}$/;

export function soloDigitos(valor: string, maximo: number): string {
  return valor.replace(/\D/g, '').slice(0, maximo);
}

export function formatearNumeroTarjeta(valor: string): string {
  const digitos = soloDigitos(valor, 19);
  return digitos.replace(/(.{4})/g, '$1 ').trim();
}

export function formatearVencimiento(valor: string): string {
  const digitos = soloDigitos(valor, 4);

  if (digitos.length <= 2) {
    return digitos;
  }

  return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
}

function pasaAlgoritmoLuhn(numero: string): boolean {
  let suma = 0;
  let duplicar = false;

  for (let i = numero.length - 1; i >= 0; i--) {
    let digito = Number(numero[i]);

    if (duplicar) {
      digito *= 2;
      if (digito > 9) {
        digito -= 9;
      }
    }

    suma += digito;
    duplicar = !duplicar;
  }

  return suma % 10 === 0;
}

function vencimientoVigente(valor: string): boolean {
  const coincidencia = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(valor);

  if (coincidencia === null) {
    return false;
  }

  const mes = Number(coincidencia[1]);
  const anio = 2000 + Number(coincidencia[2]);
  const finDeMes = new Date(anio, mes, 0, 23, 59, 59);

  return finDeMes.getTime() >= Date.now();
}

export function validarDatosPago(metodo: MetodoPagoId | '', datos: DatosPago): Record<string, string> {
  const errores: Record<string, string> = {};

  switch (metodo) {
  case 'tarjeta': {
    const numero = datos.numero_tarjeta.replace(/[\s-]/g, '');

    if (!NOMBRE.test(datos.titular_tarjeta.trim())) {
      errores.titular_tarjeta = 'Escribe el nombre del titular (solo letras, de 3 a 80 caracteres).';
    }

    if (
      !/^\d{13,19}$/.test(numero) ||
      !pasaAlgoritmoLuhn(numero)
    ) {
      errores.numero_tarjeta = 'Escribe un número de tarjeta válido.';
    }

    if (!vencimientoVigente(datos.vencimiento.trim())) {
      errores.vencimiento = 'Escribe un vencimiento válido en formato MM/AA.';
    }

    if (!/^\d{3,4}$/.test(datos.cvv.trim())) {
      errores.cvv = 'El CVV debe tener 3 o 4 dígitos.';
    }

    break;
  }
  case 'transferencia':
    if (!BANCOS.includes(datos.banco)) {
      errores.banco = 'Selecciona un banco válido.';
    }

    if (!NOMBRE.test(datos.titular_cuenta.trim())) {
      errores.titular_cuenta = 'Escribe el nombre del titular (solo letras, de 3 a 80 caracteres).';
    }

    if (!/^\d{18}$/.test(datos.clabe.trim())) {
      errores.clabe = 'La CLABE debe tener exactamente 18 dígitos.';
    }

    break;
  case 'oxxo':
    if (!NOMBRE.test(datos.nombre_pagador.trim())) {
      errores.nombre_pagador = 'Escribe el nombre de quien paga (solo letras, de 3 a 80 caracteres).';
    }

    if (!/^\d{10}$/.test(datos.telefono.trim())) {
      errores.telefono = 'El teléfono debe tener exactamente 10 dígitos.';
    }

    break;
  default:
    errores.metodo_pago = 'Selecciona un método de pago.';
  }

  return errores;
}

export function construirDatosPago(metodo: MetodoPagoId, datos: DatosPago): Record<string, string> {
  switch (metodo) {
  case 'tarjeta':
    return {
      titular_tarjeta: datos.titular_tarjeta.trim(),
      numero_tarjeta: datos.numero_tarjeta,
      vencimiento: datos.vencimiento.trim(),
      cvv: datos.cvv.trim(),
    };
  case 'transferencia':
    return {
      banco: datos.banco,
      titular_cuenta: datos.titular_cuenta.trim(),
      clabe: datos.clabe.trim(),
    };
  case 'oxxo':
    return {
      nombre_pagador: datos.nombre_pagador.trim(),
      telefono: datos.telefono.trim(),
    };
  }
}
