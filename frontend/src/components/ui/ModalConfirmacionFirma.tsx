import React from "react";
import { Button } from "./Button";
import { Alert } from "./Alert";
import { IoWarningOutline } from "react-icons/io5";

export interface ModalConfirmacionFirmaProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    cargando?: boolean;
    nombreAlumno?: string;
}

export const ModalConfirmacionFirma: React.FC<ModalConfirmacionFirmaProps> = ({
    isOpen,
    onClose,
    onConfirm,
    cargando = false,
    nombreAlumno = "el estudiante"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md bg-blanco rounded shadow-lg border border-gris-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="bg-azul-institucional text-blanco px-5 py-3.5 flex items-center gap-2.5">
                    <IoWarningOutline className="w-5 h-5 text-dorado-encabezado" />
                    <h3 className="font-bold text-base tracking-wide">
                        Confirmación de firma y aprobación
                    </h3>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    <p className="text-sm text-tinta leading-relaxed">
                        ¿Estás seguro de que deseas aprobar y firmar digitalmente la constancia para <span className="font-semibold text-azul-institucional">{nombreAlumno}</span>?
                    </p>

                    <Alert type="warning" title="Acción irreversible">
                        Una vez subida la firma y aprobado el trámite, el documento oficial quedará firmado de forma definitiva en el sistema y no se podrá revertir.
                    </Alert>

                    <div className="flex items-center justify-end gap-3 mt-2">
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            disabled={cargando}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={onConfirm}
                            disabled={cargando}
                        >
                            {cargando ? "Aprobando..." : "Sí, aprobar y firmar"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
