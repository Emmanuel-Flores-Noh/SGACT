import { generatePDF, PDFOptions } from "pdf-node"
import * as fs from 'fs'
import * as path from 'path'
import { IUsuario } from "../interfaces"

export default async function generarPDF(plantilla: string, alumno: IUsuario, revisor: IUsuario, archivoFirma: string) {
    try {
        const pdf = await generatePDF({
            html: path.join(__dirname, plantilla),
            data: {
                alumno: alumno,
                revisor: revisor,
                archivoFirma: archivoFirma
            },
            pdfOptions: {

            },
            path: path.join(__dirname, 'documents', alumno.nombres + "-" + Date.now() + ".pdf")
        })
    } catch( error ) {
        throw error;
    }
}