import { POST, GET } from "./apiConnection";

export interface FirmaRevisorRespuesta {
    message: string;
    id?: number;
    nombre_archivo: string;
}

export interface FirmaPreconfigurada {
    id: number;
    revisor_id: number;
    nombre_archivo: string;
    preconfigurada: boolean;
    imagenBase64?: string | null;
}

export async function obtenerFirmasPreconfiguradas(): Promise<FirmaPreconfigurada[]> {
    const res = await GET("/api/firmas/preconfiguradas");

    if (!res.ok) {
        throw new Error("Error al obtener las firmas preconfiguradas.");
    }

    return res.json();
}

export async function guardarFirmaPreconfigurada(imagenBase64: string): Promise<FirmaRevisorRespuesta> {
    const res = await POST("/api/firmas/preconfiguradas", { imagenBase64 });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Error al guardar la firma preconfigurada.");
    }

    return res.json();
}

export async function guardarFirma(imagenBase64: string): Promise<FirmaRevisorRespuesta> {
    const res = await POST("/api/firmas", { imagenBase64 });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Error al guardar la firma.");
    }

    return res.json();
}
