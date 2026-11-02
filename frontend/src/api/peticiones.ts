import { POST } from "./apiConnection";

export async function actualizarEstadoPeticion(peticionId: number, estado: string, firmaId?: number) {
    const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api/peticiones/${peticionId}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            estado_nuevo: estado,
            firma_id: firmaId
        }),
        credentials: "include"
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.mensaje || "Error al actualizar el estado de la petición");
    }

    return res.json();
}
