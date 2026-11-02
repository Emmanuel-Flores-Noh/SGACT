import { Request, Response } from "express";
import firma_revisor from "../models/firmaRevisor";
import { StatusCodes } from "http-status-codes";
import * as fs from "fs";
import * as path from "path";

const FIRMAS_PRECONFIGURADAS_DIR = path.resolve(__dirname, "../firmas_preconfiguradas");
const FIRMAS_DIR = path.resolve(__dirname, "../firmas");

async function obtenerFirmasPreconfigurardasRevisor(req: Request, res: Response) {
    // @ts-ignore
    const revisorId: number | undefined = req.session.usuarioId;
    if (revisorId === undefined) {
        res.status(StatusCodes.FORBIDDEN).json({ message: "No autenticado" });
        return;
    }
    const firmas = await firma_revisor.obtenerFirmasPreconfiguradas(revisorId);
    
    // Devolver lista enriquecida con la imagen en base64 si el archivo existe
    const resultado = firmas.map(f => {
        const ruta = path.join(FIRMAS_PRECONFIGURADAS_DIR, f.nombre_archivo);
        let base64: string | null = null;
        if (fs.existsSync(ruta)) {
            const buf = fs.readFileSync(ruta);
            base64 = `data:image/png;base64,${buf.toString('base64')}`;
        }
        return {
            ...f,
            imagenBase64: base64
        };
    });

    res.json(resultado);
}

async function agregarFirmaPreconfigurada(req: Request, res: Response) {
    const { imagenBase64 } = req.body;

    if (!imagenBase64) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "No se proporcionó la imagen de la firma." });
        return;
    }

    // @ts-ignore
    const revisorId: number = req.session.usuarioId;

    if (revisorId === undefined) {
        res.sendStatus(StatusCodes.FORBIDDEN);
        return;
    }

    try {
        const base64Data = imagenBase64.includes(",")
            ? imagenBase64.split(",")[1]
            : imagenBase64;

        const buffer = Buffer.from(base64Data, "base64");

        if (buffer.length === 0) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "La imagen está vacía." });
            return;
        }

        if (!fs.existsSync(FIRMAS_PRECONFIGURADAS_DIR)) {
            fs.mkdirSync(FIRMAS_PRECONFIGURADAS_DIR, { recursive: true });
        }

        const nombreArchivo = `firma_${revisorId}_${Date.now()}.png`;
        const rutaCompleta = path.join(FIRMAS_PRECONFIGURADAS_DIR, nombreArchivo);

        fs.writeFileSync(rutaCompleta, buffer);

        const dbRes = await firma_revisor.agregarFirma(revisorId, nombreArchivo, true);
        const firmaId = dbRes?.insertId !== undefined ? Number(dbRes.insertId) : undefined;

        res.status(StatusCodes.CREATED).json({
            message: "Firma preconfigurada guardada exitosamente.",
            id: firmaId,
            nombre_archivo: nombreArchivo
        });
    } catch (error) {
        console.error("Error al guardar firma preconfigurada:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al guardar la firma." });
    }
}

async function agregarFirma(req: Request, res: Response) {
    const { imagenBase64 } = req.body;

    if (!imagenBase64) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "No se proporcionó la imagen de la firma." });
        return;
    }

    // @ts-ignore
    const revisorId: number = req.session.usuarioId;

    if (revisorId === undefined) {
        res.sendStatus(StatusCodes.FORBIDDEN);
        return;
    }

    try {
        const base64Data = imagenBase64.includes(",")
            ? imagenBase64.split(",")[1]
            : imagenBase64;

        const buffer = Buffer.from(base64Data, "base64");

        if (buffer.length === 0) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "La imagen está vacía." });
            return;
        }

        if (!fs.existsSync(FIRMAS_DIR)) {
            fs.mkdirSync(FIRMAS_DIR, { recursive: true });
        }

        const nombreArchivo = `firma_${revisorId}_${Date.now()}.png`;
        const rutaCompleta = path.join(FIRMAS_DIR, nombreArchivo);

        fs.writeFileSync(rutaCompleta, buffer);

        const dbRes = await firma_revisor.agregarFirma(revisorId, nombreArchivo, false);
        const firmaId = dbRes?.insertId !== undefined ? Number(dbRes.insertId) : undefined;

        res.status(StatusCodes.CREATED).json({
            message: "Firma guardada exitosamente.",
            id: firmaId,
            nombre_archivo: nombreArchivo
        });
    } catch (error) {
        console.error("Error al guardar firma:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error al guardar la firma." });
    }
}

export {
    obtenerFirmasPreconfigurardasRevisor,
    agregarFirmaPreconfigurada,
    agregarFirma,
}
