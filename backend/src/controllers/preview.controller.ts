import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as fs from "fs";
import * as path from "path";
import PeticionTramite from "../models/peticionTramite";
import Usuario from "../models/usuario";
import generarPDF from "../services/generarPDF";
import Procedimiento from "../models/procedimiento";
import { pdfToPng } from "pdf-to-png-converter"

export async function previsualizarDocumento(req: Request, res: Response) {
    const { tramite_id, firmaBase64 } = req.body;

    if( tramite_id === undefined ) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    
    const tramite = await PeticionTramite.obtenerPeticionPorId(tramite_id);
    
    if( tramite === undefined ) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    if( tramite.estado === "Finalizado" || tramite.estado === "Archivado" ) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    
    const procedimiento = await Procedimiento.obtenerPorId(tramite.procedimiento_id);
    
    if( procedimiento === undefined ) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    
    const plantilla = procedimiento.archivo_plantilla;

    const alumno = await Usuario.obtenerUsuarioPorId(tramite.alumno_id);
    /* @ts-ignore Middleware! */
    const revisor = await Usuario.obtenerUsuarioPorId(req.session.usuarioId);
    

    if( alumno === undefined || revisor === undefined ) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    
    const nombreArchivo = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`; 
    const tmpFolder = path.resolve("./tmp");
    const pdfFile = path.join(tmpFolder, nombreArchivo, ".pdf");
    const pngFolder = path.join(tmpFolder, nombreArchivo + "/")
    const pngFile = path.join(pngFolder, "1.png")

    await generarPDF(plantilla, alumno, revisor, firmaBase64, {
        outputPath: pdfFile
    });
    

    // Convertir pdf a png necesita cambiarse para una integracion con node
    await pdfToPng(pdfFile, {
        pagesToProcess: [1],
        outputFolder: pngFolder
    })

    if (fs.existsSync(pngFile)) {
        const imgBuffer = fs.readFileSync(pngFile);
        const base64Image = `data:image/png;base64,${imgBuffer.toString("base64")}`;

        return res.status(StatusCodes.OK).json({
            imagen: base64Image,
            alumno: {
                nombreCompleto: [alumno.nombres, alumno.apellido_paterno, alumno.apellido_materno].filter(Boolean).join(" "),
                matricula: alumno.matricula,
                carrera: alumno.carrera
            }
        });
    }
    else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            mensaje: "No se pudo generar la imagen del documento"
        });
    }
}