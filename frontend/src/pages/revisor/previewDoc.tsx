import React from "react";

export interface PreviewDocProps {
    imagen?: string | null;
    cargando?: boolean;
    error?: string | null;
}

export default function PreviewDoc({
    imagen,
    cargando = false,
    error = null
}: PreviewDocProps): React.JSX.Element {
    return (
        <div className="flex flex-col items-center justify-center p-4 h-full min-h-[500px]">
            <div className="w-full max-w-lg bg-blanco rounded shadow-md border border-gris-200 overflow-hidden flex flex-col items-center justify-center p-3">
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-gris-200">
                    <span className="text-xs uppercase font-bold text-azul-institucional tracking-wide">
                        Vista previa del documento
                    </span>
                    {cargando && (
                        <span className="text-xs text-dorado-encabezado animate-pulse font-semibold">
                            Actualizando vista...
                        </span>
                    )}
                </div>

                <div className="relative w-full flex items-center justify-center min-h-[460px] bg-gris-050 rounded-sm overflow-hidden">
                    {cargando && (
                        <div className="absolute inset-0 bg-blanco/70 z-10 flex flex-col items-center justify-center gap-2">
                            <div className="w-8 h-8 border-3 border-azul-institucional border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs text-azul-texto font-semibold">Generando previsualización...</p>
                        </div>
                    )}

                    {error ? (
                        <div className="p-4 text-center text-err-600 text-sm">
                            <p className="font-bold">Error de visualización</p>
                            <p className="text-xs text-gris-700 mt-1">{error}</p>
                        </div>
                    ) : imagen ? (
                        <img
                            src={imagen}
                            alt="Documento oficial"
                            className="w-full h-auto object-contain max-h-[750px] shadow-sm rounded-sm"
                        />
                    ) : (
                        <div className="text-center p-6 text-gris-500 text-sm">
                            <p>Cargando documento oficial...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
