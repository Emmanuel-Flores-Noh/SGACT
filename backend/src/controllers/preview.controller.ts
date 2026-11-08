import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import PeticionTramite from "../models/peticionTramite";
import Usuario from "../models/usuario";
import generarPDF from "../services/generarPDF";

const execAsync = promisify(exec);

export async function previsualizarDocumento(req: Request, res: Response) {
    try {
        const peticionId = Number(req.params.id);
        const { firmaBase64 } = req.body; // Imagen de firma opcional (base64 o string data-uri)

        // @ts-ignore
        const revisorId = req.session.usuarioId;

        // Validar petición
        let alumno: any;
        let plantilla = "../templates/constancia.hbs";

        if (!isNaN(peticionId) && peticionId > 0) {
            const peticion = await PeticionTramite.obtenerPeticionPorId(peticionId);
            if (peticion) {
                alumno = await Usuario.obtenerUsuarioPorId(peticion.alumno_id);
                if (peticion.archivo_plantilla) {
                    plantilla = `../templates/${peticion.archivo_plantilla}`;
                }
            }
        }

        // Si no se encontró alumno o no se pasó ID válida, usar mock institucional
        if (!alumno) {
            alumno = {
                id: 0,
                matricula: "A20203669",
                correo: "alumno@alumnos.uady.mx",
                nombres: "Emmanuel Adrián",
                apellido_paterno: "Flores",
                apellido_materno: "Noh",
                password: "",
                rol: "Alumno",
                carrera: "Licenciatura en Ingeniería de Software"
            };
        }

        // Revisor autenticado o fallback
        let revisor: any;
        if (revisorId) {
            revisor = await Usuario.obtenerUsuarioPorId(revisorId);
        }
        if (!revisor) {
            revisor = {
                id: 2,
                matricula: undefined,
                correo: "control.escolar@uady.mx",
                nombres: "Dra. Patricia",
                apellido_paterno: "Mendoza",
                apellido_materno: "Canul",
                password: "",
                rol: "Revisor",
                carrera: undefined
            };
        }

        const randomSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const tmpDir = path.resolve(__dirname, "../../documents");
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        const tempPdfPath = path.join(tmpDir, `preview_${randomSuffix}.pdf`);
        const tempImgPrefix = path.join(tmpDir, `preview_img_${randomSuffix}`);
        const finalImgPath = `${tempImgPrefix}.png`;

        // Generar PDF
        await generarPDF(plantilla, alumno, revisor, firmaBase64 || "", {
            outputPath: tempPdfPath
        });

        // Convertir primera página a PNG con pdftoppm
        await execAsync(`pdftoppm -png -r 150 -singlefile "${tempPdfPath}" "${tempImgPrefix}"`);

        // Leer la imagen y enviarla en base64
        if (fs.existsSync(finalImgPath)) {
            const imgBuffer = fs.readFileSync(finalImgPath);
            const base64Image = `data:image/png;base64,${imgBuffer.toString("base64")}`;

            // Limpieza de archivos temporales
            try {
                if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
                if (fs.existsSync(finalImgPath)) fs.unlinkSync(finalImgPath);
            } catch (cleanupErr) {
                console.error("Error al limpiar archivos temporales de preview:", cleanupErr);
            }

            return res.status(StatusCodes.OK).json({
                imagen: base64Image,
                alumno: {
                    nombreCompleto: [alumno.nombres, alumno.apellido_paterno, alumno.apellido_materno].filter(Boolean).join(" "),
                    matricula: alumno.matricula,
                    carrera: alumno.carrera
                }
            });
        } else {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                mensaje: "No se pudo generar la imagen del documento"
            });
        }
    } catch (error: any) {
        console.error("Error en previsualizarDocumento:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            mensaje: "Error al previsualizar el documento",
            error: error.message
        });
    }
}
