/**
 * Hooks React Query para Expedientes.
 *
 * useExpedientes() → lista expedientes con filtros opcionales (GET)
 */
import { useQuery } from "@tanstack/react-query";
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
