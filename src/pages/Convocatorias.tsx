import { Plus, Calendar, Users, FileText, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { convocatorias, type Convocatoria } from "@/lib/mock-data";

export default function Convocatorias() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Convocatorias</h1>
          <p className="text-sm text-muted-foreground">Gestión de convocatorias de vinculación</p>
        </div>
        <Button onClick={() => navigate("/convocatorias/nueva")}>
          <Plus className="mr-2 h-4 w-4" />Nueva Convocatoria
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {convocatorias.map((c) => (
          <ConvocatoriaCard key={c.id} convocatoria={c} />
        ))}
      </div>
    </div>
  );
}

function ConvocatoriaCard({ convocatoria }: { convocatoria: Convocatoria }) {
  return (
    <div className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <Badge variant={convocatoria.status === "abierta" ? "default" : "secondary"}>
          {convocatoria.status === "abierta" ? "Abierta" : "Cerrada"}
        </Badge>
        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <h3 className="mb-2 text-base font-semibold text-card-foreground">{convocatoria.title}</h3>
      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{convocatoria.description}</p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {convocatoria.startDate}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {convocatoria.applicantsCount}
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {convocatoria.requiredDocuments.length} docs
        </span>
      </div>
    </div>
  );
}
