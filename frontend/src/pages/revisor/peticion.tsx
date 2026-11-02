import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CanvasFirma, { CanvasFirmaRef } from "./canvasFirma";
import PreviewDoc from "./previewDoc";
import { obtenerPreviewDocumento } from "../../api/preview";
import { obtenerFirmasPreconfiguradas, guardarFirma, FirmaPreconfigurada } from "../../api/firmas";
import { actualizarEstadoPeticion } from "../../api/peticiones";
import { Button, ModalConfirmacionFirma, Alert } from "../../components";
import { IoArrowBack, IoCheckmarkCircleOutline } from "react-icons/io5";

export default function Peticion(): React.JSX.Element {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const canvasRef = useRef<CanvasFirmaRef>(null);

    // Obtener id de la petición si viene por query string ej. ?id=1 o ?peticion_id=1
    const peticionIdParam = searchParams.get("id") || searchParams.get("peticion_id");
    const peticionId = peticionIdParam ? Number(peticionIdParam) : 1;

    // Estados de preview
    const [imagenDoc, setImagenDoc] = useState<string | null>(null);
    const [cargandoPreview, setCargandoPreview] = useState<boolean>(true);
    const [errorPreview, setErrorPreview] = useState<string | null>(null);
    const [alumnoInfo, setAlumnoInfo] = useState<string>("Alumno");

    // Modal y estados de aprobación
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [aprobando, setAprobando] = useState<boolean>(false);
    const [mensajeExito, setMensajeExito] = useState<string | null>(null);
    const [errorAccion, setErrorAccion] = useState<string | null>(null);

    // Gestión de firmas
    const [modoFirma, setModoFirma] = useState<"dibujar" | "preconfigurada">("dibujar");
    const [firmasPreconfiguradas, setFirmasPreconfiguradas] = useState<FirmaPreconfigurada[]>([]);
    const [firmaSeleccionada, setFirmaSeleccionada] = useState<FirmaPreconfigurada | null>(null);
    const [firmaActualBase64, setFirmaActualBase64] = useState<string>("");

    // Debounce timer para actualizar la vista previa al firmar
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Cargar firmas preconfiguradas del revisor
    useEffect(() => {
        async function fetchFirmas() {
            try {
                const lista = await obtenerFirmasPreconfiguradas();
                setFirmasPreconfiguradas(lista);
            } catch (err) {
                console.error("Error al cargar firmas preconfiguradas:", err);
            }
        }
        fetchFirmas();
    }, []);

    const cargarPreview = useCallback(async (firmaBase64?: string) => {
        try {
            setCargandoPreview(true);
            setErrorPreview(null);
            const respuesta = await obtenerPreviewDocumento(peticionId, firmaBase64);
            setImagenDoc(respuesta.imagen);
            if (respuesta.alumno?.nombreCompleto) {
                setAlumnoInfo(respuesta.alumno.nombreCompleto);
            }
        } catch (err: any) {
            console.error("Error al cargar vista previa del documento:", err);
            setErrorPreview(err.message || "No se pudo generar la vista previa del documento");
        } finally {
            setCargandoPreview(false);
        }
    }, [peticionId]);

    // Cargar documento inicial sin firma al entrar
    useEffect(() => {
        cargarPreview();
    }, [cargarPreview]);

    // Al soltar el mouse o terminar trazo en el Canvas
    function handleFirmaCanvasCambio(firmaBase64: string) {
        setFirmaActualBase64(firmaBase64);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            cargarPreview(firmaBase64);
        }, 200);
    }

    // Al seleccionar una firma preconfigurada existente
    function handleSeleccionarPreconfigurada(firma: FirmaPreconfigurada) {
        setFirmaSeleccionada(firma);
        const base64 = firma.imagenBase64 || "";
        setFirmaActualBase64(base64);
        setErrorAccion(null);
        cargarPreview(base64);
    }

    // Cambiar entre modo de dibujar y modo de preconfigurada
    function cambiarModoFirma(nuevoModo: "dibujar" | "preconfigurada") {
        setModoFirma(nuevoModo);
        setErrorAccion(null);
        if (nuevoModo === "dibujar") {
            setFirmaSeleccionada(null);
            canvasRef.current?.limpiar();
            setFirmaActualBase64("");
            cargarPreview("");
        } else {
            if (firmasPreconfiguradas.length > 0) {
                handleSeleccionarPreconfigurada(firmasPreconfiguradas[0]);
            } else {
                setFirmaSeleccionada(null);
                setFirmaActualBase64("");
                cargarPreview("");
            }
        }
    }

    // Validar e iniciar flujo de aprobación
    function handleAbrirConfirmacion() {
        setErrorAccion(null);
        // Validar que exista una firma activa
        if (!firmaActualBase64 || firmaActualBase64.trim() === "") {
            setErrorAccion("No se puede aprobar sin firma. Por favor dibuja una firma o selecciona una preconfigurada.");
            return;
        }
        setIsModalOpen(true);
    }

    // Confirmación final e irreversible
    async function handleConfirmarAprobacion() {
        try {
            setAprobando(true);
            setErrorAccion(null);

            let idFirmaFinal: number | undefined = undefined;

            if (modoFirma === "preconfigurada" && firmaSeleccionada) {
                idFirmaFinal = firmaSeleccionada.id;
            } else {
                // Subir la firma dibujada al backend (carpeta firmas/)
                const resFirma = await guardarFirma(firmaActualBase64);
                idFirmaFinal = resFirma.id;
            }

            // Actualizar estado del trámite a 'Finalizado' y asociar firma_id
            await actualizarEstadoPeticion(peticionId, "Finalizado", idFirmaFinal);

            setIsModalOpen(false);
            setMensajeExito("¡Constancia aprobada y firmada exitosamente! El trámite ha concluido de forma definitiva.");
        } catch (err: any) {
            console.error("Error al aprobar constancia:", err);
            setErrorAccion(err.message || "Error al procesar la aprobación del trámite");
            setIsModalOpen(false);
        } finally {
            setAprobando(false);
        }
    }

    return (
        <div className="min-h-screen bg-gris-050 font-sgact flex flex-col">
            <header className="bg-azul-institucional text-blanco shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2"
                        >
                            <IoArrowBack className="w-4 h-4" />
                            <span>Regresar</span>
                        </Button>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold tracking-tight">
                                Atendiendo trámite: Constancia de Estudios
                            </h1>
                            <p className="text-xs text-gris-200">
                                Estudiante: <span className="font-semibold text-blanco">{alumnoInfo}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            onClick={handleAbrirConfirmacion}
                            disabled={!firmaActualBase64 || Boolean(mensajeExito)}
                            className="bg-ok-600 hover:opacity-90 active:opacity-95 shadow-sm px-5"
                        >
                            <IoCheckmarkCircleOutline className="w-5 h-5 mr-1.5 inline" />
                            <span>Aprobar y firmar constancia</span>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Panel de Vista Previa del Documento */}
                <div className="bg-blanco rounded border border-gris-200 shadow-sm p-4 h-full flex flex-col">
                    {mensajeExito && (
                        <div className="mb-4">
                            <Alert type="success" title="Trámite finalizado">
                                {mensajeExito}
                            </Alert>
                        </div>
                    )}
                    <PreviewDoc
                        imagen={imagenDoc}
                        cargando={cargandoPreview}
                        error={errorPreview}
                    />
                </div>

                {/* Panel para Firmar */}
                <div className="bg-blanco rounded border border-gris-200 shadow-sm p-5 h-full flex flex-col">
                    <div className="border-b border-gris-200 pb-3 mb-4">
                        <h2 className="text-base font-bold text-azul-institucional">
                            Firma del Revisor
                        </h2>
                        <p className="text-xs text-gris-500 mt-0.5">
                            Selecciona una firma preconfigurada o dibuja una nueva para estamparla en el documento.
                        </p>
                    </div>

                    {errorAccion && (
                        <div className="mb-4">
                            <Alert type="error" title="Atención">
                                {errorAccion}
                            </Alert>
                        </div>
                    )}

                    {/* Selector de modo de firma */}
                    <div className="flex rounded-sm bg-gris-100 p-1 mb-5">
                        <button
                            type="button"
                            onClick={() => cambiarModoFirma("dibujar")}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                                modoFirma === "dibujar"
                                    ? "bg-blanco text-azul-institucional shadow-xs"
                                    : "text-gris-700 hover:text-azul-institucional"
                            }`}
                        >
                            Dibujar firma en recuadro
                        </button>
                        <button
                            type="button"
                            onClick={() => cambiarModoFirma("preconfigurada")}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                                modoFirma === "preconfigurada"
                                    ? "bg-blanco text-azul-institucional shadow-xs"
                                    : "text-gris-700 hover:text-azul-institucional"
                            }`}
                        >
                            Seleccionar firma preconfigurada
                        </button>
                    </div>

                    {modoFirma === "dibujar" ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <CanvasFirma
                                ref={canvasRef}
                                onFirmaCambio={handleFirmaCanvasCambio}
                                mostrarBotonGuardar={false}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            {firmasPreconfiguradas.length === 0 ? (
                                <div className="text-center py-10 px-4 bg-gris-050 rounded-sm border border-dashed border-gris-300">
                                    <p className="text-sm font-semibold text-gris-700">
                                        No tienes firmas preconfiguradas
                                    </p>
                                    <p className="text-xs text-gris-500 mt-1">
                                        Puedes dibujar tu firma usando la pestaña "Dibujar firma en recuadro".
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                                    {firmasPreconfiguradas.map((firma) => {
                                        const seleccionada = firmaSeleccionada?.id === firma.id;
                                        return (
                                            <div
                                                key={firma.id}
                                                onClick={() => handleSeleccionarPreconfigurada(firma)}
                                                className={`cursor-pointer rounded-sm border p-3 flex flex-col items-center justify-center transition-all ${
                                                    seleccionada
                                                        ? "border-azul-institucional bg-azul-050 ring-2 ring-azul-institucional"
                                                        : "border-gris-200 bg-blanco hover:border-gris-300 hover:bg-gris-050"
                                                }`}
                                            >
                                                {firma.imagenBase64 ? (
                                                    <img
                                                        src={firma.imagenBase64}
                                                        alt="Firma"
                                                        className="max-h-24 w-auto object-contain my-2"
                                                    />
                                                ) : (
                                                    <div className="h-20 flex items-center justify-center text-xs text-gris-500">
                                                        {firma.nombre_archivo}
                                                    </div>
                                                )}
                                                <span className="text-[11px] text-gris-500 mt-1 font-mono truncate max-w-full">
                                                    {firma.nombre_archivo}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Botón de acción principal al pie del panel */}
                    <div className="border-t border-gris-200 pt-4 mt-6">
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleAbrirConfirmacion}
                            disabled={!firmaActualBase64 || Boolean(mensajeExito)}
                            className="bg-ok-600 hover:opacity-90 active:opacity-95 text-base py-3"
                        >
                            <IoCheckmarkCircleOutline className="w-5 h-5 mr-2 inline" />
                            <span>
                                {!firmaActualBase64 ? "Se requiere firma para aprobar" : "Aprobar y firmar constancia"}
                            </span>
                        </Button>
                    </div>
                </div>
            </main>

            {/* Modal de confirmación irreversible */}
            <ModalConfirmacionFirma
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmarAprobacion}
                cargando={aprobando}
                nombreAlumno={alumnoInfo}
            />
        </div>
    );
}