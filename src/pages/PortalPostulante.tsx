import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Upload, CheckCircle2, AlertTriangle, Clock, FileText, User, Briefcase } from "lucide-react";

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
  const [documentos, setDocumentos] = useState<DocumentoRequisito[]>(documentosIniciales);

  const aprobados = documentos.filter((d) => d.estado_actual === "APROBADO").length;
  const total = documentos.length;
  const progreso = total > 0 ? Math.round((aprobados / total) * 100) : 0;

  const pendientes = documentos.filter((d) => d.estado_actual === "PENDIENTE").length;
  const enRevision = documentos.filter((d) => d.estado_actual === "CARGADO").length;
  const rechazados = documentos.filter((d) => d.estado_actual === "RECHAZADO").length;

  const handleUpload = (docId: number) => {
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Bienvenido, Postulante
        </h1>
        <p className="text-muted-foreground">
          Complete la documentación requerida para su postulación.
        </p>
      </div>

      {/* Convocatoria Info */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold text-foreground">{convocatoriaDetalles.titulo}</p>
            <p className="text-sm text-muted-foreground">{convocatoriaDetalles.cargo}</p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Progreso de Documentación</CardTitle>
          <CardDescription>{aprobados} de {total} documentos aprobados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progreso} className="h-3" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{pendientes}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{enRevision}</p>
              <p className="text-xs text-muted-foreground">En Revisión</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold text-primary">{aprobados}</p>
              <p className="text-xs text-muted-foreground">Aprobados</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-center">
              <p className="text-2xl font-bold text-destructive">{rechazados}</p>
              <p className="text-xs text-muted-foreground">Rechazados</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Checklist */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Documentos Requeridos</h2>
        <p className="text-sm text-muted-foreground">
          Suba cada documento en formato PDF o JPG. Los documentos serán revisados por el equipo evaluador.
        </p>
      </div>

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
