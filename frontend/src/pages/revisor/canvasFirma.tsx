import { createRef, useState, useImperativeHandle, forwardRef } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { Button } from "../../components";
import { IoArrowUndo, IoArrowRedo } from "react-icons/io5";
import { FaEraser } from "react-icons/fa6";
import { IoIosSave } from "react-icons/io";
import { guardarFirma, guardarFirmaPreconfigurada, FirmaRevisorRespuesta } from "../../api/firmas";

export interface CanvasFirmaRef {
    exportarFirma: () => Promise<string>;
    limpiar: () => void;
}

export interface CanvasFirmaProps {
    preconfigurada?: boolean;
    onFirmaGuardada?: (resultado: FirmaRevisorRespuesta) => void;
    onFirmaCambio?: (firmaBase64: string) => void;
    mostrarBotonGuardar?: boolean;
}

const CanvasFirma = forwardRef<CanvasFirmaRef, CanvasFirmaProps>(({
    preconfigurada = false,
    onFirmaGuardada,
    onFirmaCambio,
    mostrarBotonGuardar = true
}, ref) => {
    let drawingCanvas = createRef<ReactSketchCanvasRef>();
    const [guardando, setGuardando] = useState(false);
    const [mensaje, setMensaje] = useState<{ texto: string; tipo: "ok" | "error" } | null>(null);
    
    const iconsClass = "min-w-5 min-h-5";

    useImperativeHandle(ref, () => ({
        exportarFirma: async () => {
            if (!drawingCanvas.current) return "";
            try {
                return await drawingCanvas.current.exportImage("png");
            } catch {
                return "";
            }
        },
        limpiar: () => {
            if (drawingCanvas.current) {
                drawingCanvas.current.clearCanvas();
                if (onFirmaCambio) onFirmaCambio("");
            }
        }
    }));

    async function notificarCambio() {
        if (!onFirmaCambio || !drawingCanvas.current) return;
        try {
            const imagen = await drawingCanvas.current.exportImage("png");
            onFirmaCambio(imagen);
        } catch (error) {
            console.error("Error al exportar firma en cambio:", error);
        }
    }

    async function handleUndo() {
        if (!drawingCanvas.current) return;
        drawingCanvas.current.undo();
        setTimeout(notificarCambio, 50);
    }

    async function handleRedo() {
        if (!drawingCanvas.current) return;
        drawingCanvas.current.redo();
        setTimeout(notificarCambio, 50);
    }

    async function handleClear() {
        if (!drawingCanvas.current) return;
        drawingCanvas.current.clearCanvas();
        if (onFirmaCambio) {
            onFirmaCambio("");
        }
    }

    async function handleGuardar() {
        if (!drawingCanvas.current) return;

        setGuardando(true);
        setMensaje(null);

        try {
            const imagenBase64 = await drawingCanvas.current.exportImage("png");

            if (!imagenBase64) {
                setMensaje({ texto: "No se pudo exportar la firma del canvas.", tipo: "error" });
                return;
            }

            const resultado = preconfigurada
                ? await guardarFirmaPreconfigurada(imagenBase64)
                : await guardarFirma(imagenBase64);

            setMensaje({ texto: resultado.message, tipo: "ok" });
            if (onFirmaGuardada) {
                onFirmaGuardada(resultado);
            }
            drawingCanvas.current.clearCanvas();
            if (onFirmaCambio) {
                onFirmaCambio("");
            }
        } catch (error: any) {
            setMensaje({ texto: error.message || "Error al guardar la firma.", tipo: "error" });
        } finally {
            setGuardando(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-2">
            {/* Contenedor del lienzo con eventos para detectar cuando el usuario suelta el click o touch */}
            <div
                className="w-full flex justify-center mb-4"
                onMouseUp={notificarCambio}
                onTouchEnd={notificarCambio}
            >
                <ReactSketchCanvas
                    ref={drawingCanvas}
                    className="w-64 h-56 md:w-80 md:h-64 drop-shadow-sm rounded border border-gris-300 bg-blanco"
                    strokeWidth={3}
                    strokeColor="#01457C"
                />
            </div>

            {mensaje && (
                <div className={`mb-3 px-3 py-1.5 rounded-sm text-xs font-semibold max-w-xs text-center ${
                    mensaje.tipo === "ok"
                        ? "bg-ok-050 text-ok-600 border border-ok-200"
                        : "bg-err-050 text-err-600 border border-err-200"
                }`}>
                    {mensaje.texto}
                </div>
            )}

            <div className={`gap-2 inline-grid ${mostrarBotonGuardar ? "grid-cols-3" : "grid-cols-3"}`}>
                <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleUndo}>
                    <IoArrowUndo className={iconsClass} />
                    <span>Deshacer</span>
                </Button>
                
                <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleClear}>
                    <FaEraser className={iconsClass}/>
                    <span>Borrar</span>
                </Button>

                <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleRedo}>
                    <IoArrowRedo className={iconsClass}/>
                    <span>Rehacer</span>
                </Button>

                {mostrarBotonGuardar && (
                    <>
                        <label />
                        <Button size="sm" className="gap-1.5 col-span-2" onClick={handleGuardar} disabled={guardando}>
                            <IoIosSave className={iconsClass}/>
                            <span>{guardando ? "Guardando..." : (preconfigurada ? "Guardar preconfigurada" : "Guardar firma")}</span>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
});

export default CanvasFirma;
