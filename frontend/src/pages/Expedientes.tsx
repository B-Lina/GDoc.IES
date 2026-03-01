import { FolderCheck, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { expedientes, type Expediente } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusConfig = {
  completo: { label: "Completo", icon: CheckCircle, className: "text-success" },
  en_proceso: { label: "En Proceso", icon: Clock, className: "text-info" },
  incompleto: { label: "Incompleto", icon: AlertCircle, className: "text-destructive" },
};

export default function Expedientes() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Expedientes</h1>
        <p className="text-sm text-muted-foreground">Estado consolidado por postulante</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {expedientes.map((exp) => (
          <ExpedienteCard key={exp.id} expediente={exp} />
        ))}
      </div>
    </div>
  );
}

function ExpedienteCard({ expediente }: { expediente: Expediente }) {
  const progress = Math.round((expediente.approvedDocs / expediente.totalDocs) * 100);
  const config = statusConfig[expediente.status];
  const Icon = config.icon;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FolderCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">{expediente.applicantName}</h3>
            <p className="text-xs text-muted-foreground">{expediente.convocatoriaTitle}</p>
          </div>
        </div>
        <Icon className={cn("h-5 w-5", config.className)} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progreso</span>
          <span className="font-medium text-foreground">{expediente.approvedDocs}/{expediente.totalDocs}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className={cn("text-xs font-medium", config.className)}>{config.label}</p>
      </div>
    </div>
  );
}
