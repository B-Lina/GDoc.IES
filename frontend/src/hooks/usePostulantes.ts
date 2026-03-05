/**
 * Hooks React Query para Postulantes.
 *
 * usePostulantes()     → lista todos los postulantes (GET)
 * useCrearPostulante() → mutation POST
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postulantesService } from "@/services/postulantesService";
import type { Postulante, PostulanteCreate } from "@/types/api";

export const POSTULANTES_KEY = ["postulantes"] as const;

// ── Lista ─────────────────────────────────────────────────────────────────────
export function usePostulantes() {
    return useQuery({
        queryKey: POSTULANTES_KEY,
        queryFn: postulantesService.getAll,
        staleTime: 30_000,
    });
}

// ── Mutation: crear postulante ────────────────────────────────────────────────
export function useCrearPostulante() {
    const queryClient = useQueryClient();

    return useMutation<Postulante, Error, PostulanteCreate>({
        mutationFn: postulantesService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POSTULANTES_KEY });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
}

export function useActualizarPostulante() {
    const queryClient = useQueryClient();

    return useMutation<Postulante, Error, {id: number; data: Partial<Postulante>}>({
        mutationFn: ({id,data}) => postulantesService.update(id,data),
        onSuccess: (_, datos) => {
            queryClient.invalidateQueries({ queryKey: POSTULANTES_KEY });
            queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
            queryClient.invalidateQueries({ queryKey: ["convocatorias", datos.id] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        },
    });
}
