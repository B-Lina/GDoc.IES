import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Upload, CheckCircle2, AlertTriangle, Clock, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Mock Django REST Framework Response ──

interface ConvocatoriaDetalle {
  id: number;
  titulo: string;
  cargo: string;
  empresa_id: number;
}

type EstadoDocumento = "PENDIENTE" | "CARGADO" | "APROBADO" | "RECHAZADO";

interface DocumentoRequisito {
  id: number;
  requisito_nombre: string;
  descripcion: string;
  es_obligatorio: boolean;
  estado_actual: EstadoDocumento;
  archivo_url: string | null;
  observaciones: string;
}

const convocatoriaDetalles: ConvocatoriaDetalle = {
  id: 1,
  titulo: "Docentes Cátedra 2025-I",
  cargo: "Docente de Cátedra - Ingeniería de Sistemas",
  empresa_id: 101,
};

const documentosIniciales: DocumentoRequisito[] = [
  {
    id: 1,
    requisito_nombre: "Cédula de Ciudadanía",
    descripcion: "Cargue copia legible por ambas caras",
    es_obligatorio: true,
    estado_actual: "PENDIENTE",
    archivo_url: null,
    observaciones: "",
  },
  {
    id: 2,
    requisito_nombre: "Hoja de Vida",
    descripcion: "Formato institucional diligenciado completamente",
    es_obligatorio: true,
    estado_actual: "APROBADO",
    archivo_url: "/media/documentos/hv_garcia.pdf",
    observaciones: "",
  },
  {
    id: 3,
    requisito_nombre: "Diploma de Pregrado",
    descripcion: "Copia autenticada del diploma universitario",
    es_obligatorio: true,
    estado_actual: "RECHAZADO",
    archivo_url: "/media/documentos/diploma_garcia.pdf",
    observaciones: "Documento ilegible. La resolución es muy baja y no se distingue el nombre de la institución. Por favor suba una copia con mejor calidad.",
  },
  {
    id: 4,
    requisito_nombre: "Diploma de Posgrado",
    descripcion: "Copia autenticada del título de posgrado",
    es_obligatorio: true,
    estado_actual: "CARGADO",
    archivo_url: "/media/documentos/posgrado_garcia.pdf",
    observaciones: "",
  },
  {
    id: 5,
    requisito_nombre: "Certificado de Antecedentes",
    descripcion: "Vigente, expedido hace menos de 3 meses",
    es_obligatorio: true,
    estado_actual: "PENDIENTE",
    archivo_url: null,
    observaciones: "",
  },
  {
    id: 6,
    requisito_nombre: "Certificaciones Laborales",
    descripcion: "Últimos 5 años de experiencia profesional",
    es_obligatorio: false,
    estado_actual: "PENDIENTE",
    archivo_url: null,
    observaciones: "",
  },
];

// ── Helpers ──

const estadoConfig: Record<EstadoDocumento, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  PENDIENTE: { label: "Pendiente", variant: "outline", icon: <Clock className="h-4 w-4" /> },
  CARGADO: { label: "En Revisión", variant: "secondary", icon: <FileText className="h-4 w-4" /> },
  APROBADO: { label: "Aprobado", variant: "default", icon: <CheckCircle2 className="h-4 w-4" /> },
  RECHAZADO: { label: "Rechazado", variant: "destructive", icon: <AlertTriangle className="h-4 w-4" /> },
};

// ── Component ──

export default function PortalPostulante() {
  const navigate = useNavigate();
  const [documentos, setDocumentos] = useState<DocumentoRequisito[]>(documentosIniciales);

  const aprobados = documentos.filter((d) => d.estado_actual === "APROBADO").length;
  const total = documentos.length;
  const progreso = total > 0 ? Math.round((aprobados / total) * 100) : 0;

  const handleUpload = (docId: number) => {
    // Simulate creating FormData and POSTing to Django
    // const formData = new FormData();
    // formData.append("archivo", file);
    // await fetch(`/api/documentos/${docId}/upload/`, { method: "POST", body: formData });

    setDocumentos((prev) =>
      prev.map((d) =>
        d.id === docId
          ? { ...d, estado_actual: "CARGADO" as EstadoDocumento, archivo_url: `/media/documentos/doc_${docId}.pdf`, observaciones: "" }
          : d
      )
    );

    toast({
      title: "Archivo recibido",
      description: "Su documento fue cargado exitosamente y será revisado por el equipo.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/convocatorias")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portal del Postulante</h1>
          <p className="text-muted-foreground">{convocatoriaDetalles.titulo} — {convocatoriaDetalles.cargo}</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Progreso de Documentación</CardTitle>
          <CardDescription>{aprobados} de {total} documentos aprobados</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progreso} className="h-3" />
          <p className="mt-2 text-sm text-muted-foreground text-right">{progreso}%</p>
        </CardContent>
      </Card>

      {/* Document Checklist */}
      <div className="space-y-4">
        {documentos.map((doc) => {
          const cfg = estadoConfig[doc.estado_actual];
          const isApproved = doc.estado_actual === "APROBADO";
          const isRejected = doc.estado_actual === "RECHAZADO";

          return (
            <Card key={doc.id} className={isRejected ? "border-destructive/40" : isApproved ? "border-primary/30" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {doc.requisito_nombre}
                      {doc.es_obligatorio && (
                        <span className="text-xs font-normal text-destructive">* Obligatorio</span>
                      )}
                    </CardTitle>
                    <CardDescription>{doc.descripcion}</CardDescription>
                  </div>
                  <Badge variant={cfg.variant} className="flex items-center gap-1 shrink-0">
                    {cfg.icon}
                    {cfg.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Rejected alert */}
                {isRejected && doc.observaciones && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Documento Rechazado</AlertTitle>
                    <AlertDescription>{doc.observaciones}</AlertDescription>
                  </Alert>
                )}

                {/* Upload button */}
                <div className="flex items-center gap-3">
                  <Button
                    variant={isRejected ? "destructive" : "outline"}
                    size="sm"
                    disabled={isApproved}
                    onClick={() => handleUpload(doc.id)}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {isApproved ? "Aprobado" : doc.archivo_url ? "Reemplazar archivo" : "Subir archivo"}
                  </Button>
                  {doc.archivo_url && !isRejected && (
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">{doc.archivo_url}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
