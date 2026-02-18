import { cn } from "@/lib/utils";
import type { SemaphoreStatus } from "@/lib/mock-data";

const config: Record<SemaphoreStatus, { label: string; className: string }> = {
  green: { label: "Vigente", className: "bg-semaphore-green text-success-foreground" },
  yellow: { label: "Dudas", className: "bg-semaphore-yellow text-warning-foreground" },
  red: { label: "Vencido", className: "bg-semaphore-red text-destructive-foreground" },
};

export function SemaphoreBadge({ status, className }: { status: SemaphoreStatus; className?: string }) {
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", c.className, className)}>
      <span className="h-2 w-2 rounded-full bg-current opacity-80" />
      {c.label}
    </span>
  );
}
