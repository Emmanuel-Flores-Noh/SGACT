import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import pdf from 'html-pdf-node';
import { IUsuario } from "../interfaces";

if (!process.env.OPENSSL_CONF) {
    process.env.OPENSSL_CONF = '/dev/null';
}

export interface IGenerarPDFOptions {
    outputPath?: string;
    pdfOptions?: Record<string, any>;
}

export default async function generarPDF(
    plantilla: string,
    alumno: IUsuario,
    revisor: IUsuario,
    archivoFirma: string,
    options?: IGenerarPDFOptions
) {
    try {
        const templatePath = path.isAbsolute(plantilla)
            ? plantilla
            : path.resolve("./src/templates/", plantilla);

        if (!fs.existsSync(templatePath)) {
            throw new Error(`No se encontró la plantilla en la ruta: ${templatePath}`);
        }

        const templateContent = fs.readFileSync(templatePath, 'utf-8');

        const documentsDir = path.resolve("./", 'documents');
        if (!fs.existsSync(documentsDir)) {
            fs.mkdirSync(documentsDir, { recursive: true });
        }

        const nombreCompleto = [alumno.nombres, alumno.apellido_paterno, alumno.apellido_materno]
            .filter(Boolean)
            .join(' ');
        const revisorNombre = [revisor.nombres, revisor.apellido_paterno, revisor.apellido_materno]
            .filter(Boolean)
            .join(' ');

        const finalOutputPath = options?.outputPath || path.join(
            documentsDir,
            `${alumno.nombres.replace(/\s+/g, '_')}-${Date.now()}.pdf`
        );

        const escudoPath = path.resolve("./src/templates/", 'escudo-uady.png');
        let escudoBase64 = '';
        if (fs.existsSync(escudoPath)) {
            escudoBase64 = `data:image/png;base64,${fs.readFileSync(escudoPath).toString('base64')}`;
        }

        // 1. Compilar la plantilla HTML inyectando las variables
        const template = handlebars.compile(templateContent);
        const htmlFinal = template({
            alumno,
            revisor,
            archivoFirma,
            nombreCompleto,
            matricula: alumno.matricula || '',
            carrera: alumno.carrera || 'Licenciatura',
            fechaActual: new Date().toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            revisorNombre,
            firmaImagen: archivoFirma,
            escudoBase64
        });

        // 2. Opciones de configuración de Puppeteer (html-pdf-node)
        const defaultPdfOptions = {
            format: 'Letter',
            path: finalOutputPath, // Indica a la librería que guarde el archivo físico en esta ruta
            margin: {              // En Puppeteer/html-pdf-node se utiliza 'margin', no 'border'
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px'
            },
            printBackground: true
        };

        const finalPdfOptions = {
            ...defaultPdfOptions,
            ...(options?.pdfOptions || {})
        };

        const file = { content: htmlFinal };

        // 3. Generar el PDF y retornar el buffer
        const pdfBuffer = await pdf.generatePdf(file, finalPdfOptions);

        return pdfBuffer;
    } catch (error) {
        throw error;
    }
}