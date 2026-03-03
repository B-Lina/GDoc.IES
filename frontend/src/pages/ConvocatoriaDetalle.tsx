import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useConvocatoria } from "@/hooks/useConvocatorias";

export default function ConvocatoriaDetalle() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const convocatoriaId = useMemo(() => Number(id), [id]);

  const { data, isLoading, isError } = useConvocatoria(convocatoriaId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/convocatorias")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Detalle de Convocatoria</h1>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-10 text-sm text-muted-foreground">Cargando convocatoria...</CardContent>
        </Card>
      ) : isError || !data ? (
        <Card>
          <CardContent className="py-10 text-sm text-destructive">
            No se pudo cargar la convocatoria.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-xl">{data.titulo}</CardTitle>
              <Badge variant={data.estado === "abierta" ? "default" : "secondary"}>
                {data.estado === "abierta" ? "Abierta" : "Cerrada"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{data.descripcion}</p>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm md:grid-cols-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {data.fecha_inicio} - {data.fecha_fin}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{data.postulantes_count} postulantes</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{data.documentos_requeridos.length} documentos requeridos</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
