import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { Request, Response } from 'express';
import pool from '../src/config/dbConnection';
import { DOCUMENTOS_DIR } from '../src/config/rutas';
import { descargarDocumento } from '../src/controllers/documento.controller';
import { IPeticionTramite } from '../src/interfaces';
import CacheDocumento from '../src/models/cacheDocumento';
import PeticionTramite from '../src/models/peticionTramite';
import Usuario from '../src/models/usuario';

// Usuarios simulados: 1 y 2 son alumnos, 10 es revisor
const ALUMNO_A = 1;
const ALUMNO_B = 2;
const REVISOR = 10;

const peticiones: Record<number, IPeticionTramite> = {
    1: { id: 1, alumno_id: ALUMNO_A, procedimiento_id: 1, estado: 'Finalizado', fecha_solicitud: '2026-10-25 00:19:27', firma_id: 1, archivo_plantilla: 'constancia.hbs' },
    2: { id: 2, alumno_id: ALUMNO_A, procedimiento_id: 1, estado: 'Archivado', fecha_solicitud: '2026-10-17 00:19:27', firma_id: 1, archivo_plantilla: 'constancia.hbs' },
    3: { id: 3, alumno_id: ALUMNO_A, procedimiento_id: 1, estado: 'En trámite', fecha_solicitud: '2026-10-21 00:19:27', firma_id: null, archivo_plantilla: 'constancia.hbs' },
    4: { id: 4, alumno_id: ALUMNO_A, procedimiento_id: 1, estado: 'Finalizado', fecha_solicitud: '2026-10-14 00:19:27', firma_id: null, archivo_plantilla: 'constancia.hbs' },
};

// Solo la petición 1 tiene una constancia ya generada en disco
const ARCHIVO_CACHE = 'constancia_test_descarga.pdf';
const RUTA_CACHE = path.join(DOCUMENTOS_DIR, ARCHIVO_CACHE);

PeticionTramite.obtenerPeticionPorId = async (id: number) => peticiones[id];
Usuario.comprobarRevisor = async (id: number) => id === REVISOR;
CacheDocumento.obtenerPorTramite = async (tramite_id: number) =>
    tramite_id === 1 ? { tramite_id, nombre_archivo: ARCHIVO_CACHE } : undefined;

interface Respuesta {
    status?: number;
    body?: any;
    descarga?: { ruta: string; nombre: string };
}

async function solicitar(usuarioId: number | undefined, id: string): Promise<Respuesta> {
    const respuesta: Respuesta = {};
    const req = { session: { usuarioId }, params: { id } } as unknown as Request;
    const res = {
        status(codigo: number) { respuesta.status = codigo; return this; },
        json(body: any) { respuesta.body = body; return this; },
        download(ruta: string, nombre: string) { respuesta.descarga = { ruta, nombre }; return this; },
    } as unknown as Response;

    await descargarDocumento(req, res);
    return respuesta;
}

const casos: Array<[string, () => Promise<void>]> = [
    ['Sin sesión → 403', async () => {
        const r = await solicitar(undefined, '1');
        assert.equal(r.status, 403);
    }],
    ['ID inválido → 400', async () => {
        assert.equal((await solicitar(ALUMNO_A, 'abc')).status, 400);
        assert.equal((await solicitar(ALUMNO_A, '-1')).status, 400);
    }],
    ['Petición inexistente → 404', async () => {
        assert.equal((await solicitar(ALUMNO_A, '999')).status, 404);
    }],
    ['Otro alumno no puede descargar → 403', async () => {
        const r = await solicitar(ALUMNO_B, '1');
        assert.equal(r.status, 403);
        assert.equal(r.descarga, undefined);
    }],
    ['Archivado → 410', async () => {
        assert.equal((await solicitar(ALUMNO_A, '2')).status, 410);
    }],
    ['En trámite → 409', async () => {
        assert.equal((await solicitar(ALUMNO_A, '3')).status, 409);
    }],
    ['Finalizado sin firma → 409', async () => {
        const r = await solicitar(ALUMNO_A, '4');
        assert.equal(r.status, 409);
        assert.match(r.body.mensaje, /firma/);
    }],
    ['Finalizado propio → descarga la constancia', async () => {
        const r = await solicitar(ALUMNO_A, '1');
        assert.deepEqual(r.descarga, { ruta: RUTA_CACHE, nombre: 'constancia-1.pdf' });
    }],
    ['El revisor puede descargar la de un alumno', async () => {
        const r = await solicitar(REVISOR, '1');
        assert.equal(r.descarga?.ruta, RUTA_CACHE);
    }],
];

async function runTests() {
    console.log('--- Iniciando suite de pruebas para descargarDocumento ---');
    fs.mkdirSync(DOCUMENTOS_DIR, { recursive: true });
    fs.writeFileSync(RUTA_CACHE, '%PDF-1.4 prueba');

    let failed = 0;
    for (const [nombre, prueba] of casos) {
        try {
            await prueba();
            console.log(`✓ ${nombre}`);
        } catch (err) {
            console.error(`✗ ${nombre}:`, err);
            failed++;
        }
    }

    fs.unlinkSync(RUTA_CACHE);
    await pool.end();

    console.log(`\n${casos.length - failed}/${casos.length} pruebas superadas`);
    if (failed > 0) {
        process.exit(1);
    }
}

runTests().catch((err) => {
    console.error('Error fatal al ejecutar las pruebas:', err);
    process.exit(1);
});
