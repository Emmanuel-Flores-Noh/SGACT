export const METODOS_PAGO = {
    tarjeta: 'Tarjeta de crédito o débito',
    transferencia: 'Transferencia bancaria',
    oxxo: 'Pago en OXXO',
} as const;

export type MetodoPagoId = keyof typeof METODOS_PAGO;

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

export type ValidacionPago =
    | { valido: true; metodo_id: MetodoPagoId; metodo_label: string }
    | { valido: false; errores: Record<string, string> };

const NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]{3,80}$/;
const SOLO_DIGITOS = /^\d+$/;

function normalizar(valor: unknown): string {
    return typeof valor === 'string' ? valor.trim() : '';
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

function validarTarjeta(datos: Record<string, unknown>, errores: Record<string, string>) {
    const titular = normalizar(datos.titular_tarjeta);
    const numero = normalizar(datos.numero_tarjeta).replace(/[\s-]/g, '');
    const vencimiento = normalizar(datos.vencimiento);
    const cvv = normalizar(datos.cvv);

    if (!NOMBRE.test(titular)) {
        errores.titular_tarjeta = 'Escribe el nombre del titular (solo letras, de 3 a 80 caracteres).';
    }

    if (!SOLO_DIGITOS.test(numero) || numero.length < 13 || numero.length > 19 || !pasaAlgoritmoLuhn(numero)) {
        errores.numero_tarjeta = 'Escribe un número de tarjeta válido.';
    }

    if (!vencimientoVigente(vencimiento)) {
        errores.vencimiento = 'Escribe un vencimiento válido en formato MM/AA.';
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        errores.cvv = 'El CVV debe tener 3 o 4 dígitos.';
    }
}

function validarTransferencia(datos: Record<string, unknown>, errores: Record<string, string>) {
    const banco = normalizar(datos.banco);
    const titular = normalizar(datos.titular_cuenta);
    const clabe = normalizar(datos.clabe);

    if (!BANCOS.includes(banco)) {
        errores.banco = 'Selecciona un banco válido.';
    }

    if (!NOMBRE.test(titular)) {
        errores.titular_cuenta = 'Escribe el nombre del titular (solo letras, de 3 a 80 caracteres).';
    }

    if (!/^\d{18}$/.test(clabe)) {
        errores.clabe = 'La CLABE debe tener exactamente 18 dígitos.';
    }
}

function validarOxxo(datos: Record<string, unknown>, errores: Record<string, string>) {
    const nombre = normalizar(datos.nombre_pagador);
    const telefono = normalizar(datos.telefono);

    if (!NOMBRE.test(nombre)) {
        errores.nombre_pagador = 'Escribe el nombre de quien paga (solo letras, de 3 a 80 caracteres).';
    }

    if (!/^\d{10}$/.test(telefono)) {
        errores.telefono = 'El teléfono debe tener exactamente 10 dígitos.';
    }
}

export function validarDatosPago(metodo: unknown, datos: unknown): ValidacionPago {
    if (typeof metodo !== 'string' || !Object.prototype.hasOwnProperty.call(METODOS_PAGO, metodo)) {
        return {
            valido: false,
            errores: { metodo_pago: 'Selecciona un método de pago válido.' },
        };
    }

    const metodoId = metodo as MetodoPagoId;
    const datosPago = (datos !== null && typeof datos === 'object' ? datos : {}) as Record<string, unknown>;
    const errores: Record<string, string> = {};

    switch (metodoId) {
    case 'tarjeta':
        validarTarjeta(datosPago, errores);
        break;
    case 'transferencia':
        validarTransferencia(datosPago, errores);
        break;
    case 'oxxo':
        validarOxxo(datosPago, errores);
        break;
    }

    if (Object.keys(errores).length > 0) {
        return { valido: false, errores };
    }

    return { valido: true, metodo_id: metodoId, metodo_label: METODOS_PAGO[metodoId] };
}
