import * as fs from 'fs';
import * as path from 'path';
import { IPeticionTramite } from '../interfaces';
import { DOCUMENTOS_DIR, FIRMAS_DIR, FIRMAS_PRECONFIGURADAS_DIR } from '../config/rutas';
import CacheDocumento from '../models/cacheDocumento';
import FirmaRevisor from '../models/firmaRevisor';
import HistorialEstados from '../models/historialEstados';
import Usuario from '../models/usuario';
import generarPDF from './generarPDF';

const TIPOS_IMAGEN: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
};

function leerFirmaBase64(nombre_archivo: string, preconfigurada: boolean): string | undefined {
    const carpeta = preconfigurada ? FIRMAS_PRECONFIGURADAS_DIR : FIRMAS_DIR;
    const ruta = path.join(carpeta, path.basename(nombre_archivo));
    const tipo = TIPOS_IMAGEN[path.extname(ruta).toLowerCase()];

    if (!tipo || !fs.existsSync(ruta)) {
        return undefined;
    }

    return `data:${tipo};base64,${fs.readFileSync(ruta).toString('base64')}`;
}

/**
 * Devuelve la ruta en disco del PDF de la constancia firmada de un trámite.
 *
 * La primera descarga lo genera y lo registra en `cache_documentos`; las siguientes reutilizan
 * el mismo archivo, así el contenido y la fecha de emisión no cambian entre descargas.
 * Devuelve `undefined` si el trámite no tiene una firma, alumno o revisor con qué generarlo.
 */
export default async function obtenerConstancia(peticion: IPeticionTramite): Promise<string | undefined> {
    const cache = await CacheDocumento.obtenerPorTramite(peticion.id);
    if (cache) {
        const rutaCache = path.join(DOCUMENTOS_DIR, path.basename(cache.nombre_archivo));
        if (fs.existsSync(rutaCache)) {
            return rutaCache;
        }
    }

    if (peticion.firma_id == null || !peticion.archivo_plantilla) {
        return undefined;
    }

    const firma = await FirmaRevisor.obtenerFirmaPorId(Number(peticion.firma_id));
    if (!firma) {
        return undefined;
    }

    const firmaBase64 = leerFirmaBase64(firma.nombre_archivo, Boolean(firma.preconfigurada));
    if (!firmaBase64) {
        return undefined;
    }

    const [alumno, revisor] = await Promise.all([
        Usuario.obtenerUsuarioPorId(peticion.alumno_id),
        Usuario.obtenerUsuarioPorId(firma.revisor_id),
    ]);
    if (!alumno || !revisor) {
        return undefined;
    }

    // La constancia lleva la fecha en que se finalizó el trámite, no la de la descarga.
    const fechaEmision = await HistorialEstados.obtenerFechaCambioEstado(peticion.id, 'Finalizado') ?? new Date();

    fs.mkdirSync(DOCUMENTOS_DIR, { recursive: true });
    const nombreArchivo = `constancia_${peticion.id}.pdf`;
    const ruta = path.join(DOCUMENTOS_DIR, nombreArchivo);

    await generarPDF(peticion.archivo_plantilla, alumno, revisor, firmaBase64, {
        outputPath: ruta,
        fechaEmision,
    });
    await CacheDocumento.guardar(peticion.id, nombreArchivo);

    return ruta;
}
