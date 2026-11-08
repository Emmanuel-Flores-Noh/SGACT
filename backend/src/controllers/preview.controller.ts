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
    const { firmaBase64 } = req.body;
    const tramite_id= Number(req.params.id);

    if( tramite_id === undefined ) {
        res.status(StatusCodes.BAD_REQUEST).json({mensaje: "No se ha especificado el id del procedimiento"});
        return;
    }
    
    const tramite = await PeticionTramite.obtenerPeticionPorId(tramite_id);
    
    if( tramite === undefined ) {
        res.status(StatusCodes.BAD_REQUEST).json({mensaje: "No existe el id del procedimiento en la base de datos"});
        return;
    }

    if( tramite.estado === "Finalizado" || tramite.estado === "Archivado" ) {
        res.status(StatusCodes.BAD_REQUEST).json({mensaje: "El tramite esta finalizado o archivado"});
        return;
    }
    
    const procedimiento = await Procedimiento.obtenerPorId(tramite.procedimiento_id);
    
    if( procedimiento === undefined ) {
        res.status(StatusCodes.BAD_REQUEST).json({mensaje: "El procedimiento no se encuentra en la base de datos"});
        return;
    }
    
    const plantilla = procedimiento.archivo_plantilla;

    const alumno = await Usuario.obtenerUsuarioPorId(tramite.alumno_id);
    /* @ts-ignore Middleware! */
    const revisor = await Usuario.obtenerUsuarioPorId(req.session.usuarioId);
    

    if( alumno === undefined ) {
        res.status(StatusCodes.BAD_REQUEST).json({mensaje: "no se encuentra el alumno en la base de datos"});
        return;
    }
    
    if( revisor === undefined ) {
        res.status(StatusCodes.BAD_REQUEST).json({mensaje: "no se encuentra el revisor en la base de datos"});
        return;
    }
    
    const nombreArchivo = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`; 
    const tmpFolder = path.resolve("./tmp");
    
    if ( ! fs.existsSync(tmpFolder) ) {
        fs.mkdirSync(tmpFolder);
    }

    const pdfFile = path.join(tmpFolder, nombreArchivo + ".pdf");
    const pngFolder = path.join(tmpFolder, nombreArchivo + "/")
    const pngFile = path.join(pngFolder, "1.png")

    try {
        await generarPDF(plantilla, alumno, revisor, firmaBase64, {
            outputPath: pdfFile
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({mensaje: "Error al generar el archivo pdf"})
        console.log(error)
        return;
    }
    

    try {
        await pdfToPng(pdfFile, {
            pagesToProcess: [1],
            outputFolder: pngFolder,
            outputFileMaskFunc: (pageNumber) => `${pageNumber}.png`
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({mensaje: "Error al generar la imagen apartir del pdf"})
        console.log(error);
        return;
    }

    if (fs.existsSync(pngFile)) {
        const imgBuffer = fs.readFileSync(pngFile);
        const base64Image = `data:image/png;base64,${imgBuffer.toString("base64")}`;

        res.status(StatusCodes.OK).json({
            imagen: base64Image,
            alumno: {
                nombreCompleto: [alumno.nombres, alumno.apellido_paterno, alumno.apellido_materno].filter(Boolean).join(" "),
                matricula: alumno.matricula,
                carrera: alumno.carrera
            }
        });
        
        fs.unlinkSync(pngFile)
        fs.rmdirSync(pngFolder)
        fs.unlinkSync(pdfFile)
    }
    else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            mensaje: "No se pudo generar la imagen del documento"
        });
    }
}