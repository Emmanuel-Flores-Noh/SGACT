import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import generarPDF from '../src/services/generarPDF';
import { IUsuario } from '../src/interfaces';

const alumnoMock: IUsuario = {
    id: 101,
    matricula: 'A18001234',
    correo: 'alumno.prueba@alumnos.uady.mx',
    nombres: 'Carlos Eduardo',
    apellido_paterno: 'Ramírez',
    apellido_materno: 'Pech',
    password: 'password123',
    rol: 'Alumno',
    carrera: 'Licenciatura en Ingeniería de Software'
};

const revisorMock: IUsuario = {
    id: 202,
    matricula: undefined,
    correo: 'revisor.academico@uady.mx',
    nombres: 'Dra. Patricia',
    apellido_paterno: 'Mendoza',
    apellido_materno: 'Canul',
    password: 'password123',
    rol: 'Revisor',
    carrera: undefined
};

// 1x1 pixel transparente en base64 para simular la firma digital
const firmaBase64Mock = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const generatedFilesToClean: string[] = [];

function registerForCleanup(filePath?: string) {
    if (filePath) {
        generatedFilesToClean.push(filePath);
    }
}

function cleanup() {
    for (const file of generatedFilesToClean) {
        if (fs.existsSync(file)) {
            try {
                fs.unlinkSync(file);
            } catch {
                // Silencioso en caso de error al borrar
            }
        }
    }
}

async function runTests() {
    console.log('--- Iniciando suite de pruebas para generarPDF ---');
    let passed = 0;
    let failed = 0;

    // Prueba 1: Generación exitosa de constancia
    try {
        console.log('\n[TEST 1] Generación de PDF con plantilla constancia.hbs y ruta relativa...');
        const resultado: any = await generarPDF(
            'constancia.hbs',
            alumnoMock,
            revisorMock,
            firmaBase64Mock
        );

        assert.ok(resultado, 'El resultado de generarPDF no debe ser nulo');
        assert.ok(resultado.filename, 'El resultado debe incluir la propiedad filename');
        assert.ok(fs.existsSync(resultado.filename), `El archivo PDF generado debe existir en disco: ${resultado.filename}`);
        registerForCleanup(resultado.filename);

        const stats = fs.statSync(resultado.filename);
        assert.ok(stats.size > 0, 'El archivo PDF no debe estar vacío');

        // Verificar encabezado mágico "%PDF"
        const buffer = fs.readFileSync(resultado.filename);
        const header = buffer.subarray(0, 4).toString('ascii');
        assert.equal(header, '%PDF', 'El archivo generado debe tener la firma de formato PDF (%PDF)');

        console.log(`✓ TEST 1 superado (PDF creado: ${path.basename(resultado.filename)}, ${stats.size} bytes)`);
        passed++;
    } catch (err) {
        console.error('✗ TEST 1 falló:', err);
        failed++;
    }
}


runTests().catch((err) => {
    cleanup();
    console.error('Error fatal al ejecutar las pruebas:', err);
    process.exit(1);
});
