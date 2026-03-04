/**
 * Hooks React Query para Expedientes.
 *
 * useExpedientes() → lista expedientes con filtros opcionales (GET)
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expedientesService, type ExpedientesFiltros } from "@/services/expedientesService";

export const EXPEDIENTES_KEY = ["expedientes"] as const;

// ── Lista ─────────────────────────────────────────────────────────────────────
export function useExpedientes(filtros?: ExpedientesFiltros) {
    return useQuery({
        queryKey: [...EXPEDIENTES_KEY, filtros],
        queryFn: () => expedientesService.getAll(filtros),
        staleTime: 30_000,
    });
}

export function useCrearExpediente() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: expedientesService.create,
        onSuccess: (_, datos) => {
            // actualizar listas relevantes
            queryClient.invalidateQueries({ queryKey: EXPEDIENTES_KEY });
            queryClient.invalidateQueries({ queryKey: ["convocatorias"] });
            queryClient.invalidateQueries({ queryKey: ["convocatorias", datos.convocatoria] });
        },
    });
}
