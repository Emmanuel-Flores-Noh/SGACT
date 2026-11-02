import { POST } from "./apiConnection";

export interface PreviewResponse {
    imagen: string;
    alumno?: {
        nombreCompleto: string;
        matricula?: string;
        carrera?: string;
    };
    mensaje?: string;
}

export async function obtenerPreviewDocumento(peticionId?: number, firmaBase64?: string): Promise<PreviewResponse> {
    const endpoint = peticionId ? `/api/peticiones/${peticionId}/preview` : `/api/peticiones/preview`;
    const res = await POST(endpoint, {
        firmaBase64: firmaBase64 || ""
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.mensaje || "Error al obtener la previsualización del documento");
    }

    return res.json();
}
