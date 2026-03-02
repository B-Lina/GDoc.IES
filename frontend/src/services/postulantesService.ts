/**
 * Servicio para Postulantes.
 * Endpoints: GET /api/postulantes/ · POST /api/postulantes/
 */
import { apiClient } from "@/lib/api";
import type { Postulante, PostulanteCreate, PaginatedResponse } from "@/types/api";

export const postulantesService = {
    /**
     * Lista todos los postulantes (paginado).
     * GET /api/postulantes/
     */
    getAll: (): Promise<PaginatedResponse<Postulante>> =>
        apiClient.get<PaginatedResponse<Postulante>>("/postulantes/"),

    /**
     * Obtiene un postulante por ID.
     * GET /api/postulantes/{id}/
     */
    getById: (id: number): Promise<Postulante> =>
        apiClient.get<Postulante>(`/postulantes/${id}/`),

    /**
     * Crea un nuevo postulante.
     * POST /api/postulantes/
     */
    create: (data: PostulanteCreate): Promise<Postulante> =>
        apiClient.post<Postulante>("/postulantes/", data),

    /**
     * Actualiza parcialmente un postulante.
     * PATCH /api/postulantes/{id}/
     */
    update: (id: number, data: Partial<PostulanteCreate>): Promise<Postulante> =>
        apiClient.patch<Postulante>(`/postulantes/${id}/`, data),
};
