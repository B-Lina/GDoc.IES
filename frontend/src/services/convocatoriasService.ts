/**
 * Servicio para Convocatorias.
 * Endpoints: GET /api/convocatorias/ · POST /api/convocatorias/ · GET /api/convocatorias/{id}/
 */
import { apiClient } from "@/lib/api";
import type {
    Convocatoria,
    ConvocatoriaCreate,
    PaginatedResponse,
} from "@/types/api";

export const convocatoriasService = {
    /**
     * Lista todas las convocatorias (paginado).
     * GET /api/convocatorias/
     */
    getAll: (): Promise<PaginatedResponse<Convocatoria>> =>
        apiClient.get<PaginatedResponse<Convocatoria>>("/convocatorias/"),

    /**
     * Obtiene una convocatoria por ID.
     * GET /api/convocatorias/{id}/
     */
    getById: (id: number): Promise<Convocatoria> =>
        apiClient.get<Convocatoria>(`/convocatorias/${id}/`),

    /**
     * Crea una nueva convocatoria.
     * POST /api/convocatorias/
     */
    create: (data: ConvocatoriaCreate): Promise<Convocatoria> =>
        apiClient.post<Convocatoria>("/convocatorias/", data),

    /**
     * Actualiza parcialmente una convocatoria.
     * PATCH /api/convocatorias/{id}/
     */
    update: (id: number, data: Partial<ConvocatoriaCreate>): Promise<Convocatoria> =>
        apiClient.patch<Convocatoria>(`/convocatorias/${id}/`, data),
};
