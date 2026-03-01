import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, Calendar, MapPin, Briefcase, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { convocatorias } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DetalleConvocatoria() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const convocatoria = convocatorias.find(c => c.id === id);
  const [postulantDialogOpen, setPostulantDialogOpen] = useState(false);

  // Estado del formulario de postulante
  const [newPostulante, setNewPostulante] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumento: "Cédula de Ciudadanía",
    numeroDocumento: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  if (!convocatoria) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/convocatorias")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Convocatoria no encontrada</p>
        </div>
      </div>
    );
  }

  const handleAddPostulante = () => {
    if (!newPostulante.nombres.trim() || !newPostulante.apellidos.trim() || !newPostulante.email.trim() || !newPostulante.numeroDocumento.trim()) {
      toast({
        title: "Formulario incompleto",
        description: "Por favor complete los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    // Crear nuevo postulante
    const nuevoPostulante = {
      id: `postulante-${Date.now()}`,
      nombres: newPostulante.nombres.trim(),
      apellidos: newPostulante.apellidos.trim(),
      tipoDocumento: newPostulante.tipoDocumento,
      numeroDocumento: newPostulante.numeroDocumento.trim(),
      email: newPostulante.email.trim(),
      telefono: newPostulante.telefono.trim(),
      direccion: newPostulante.direccion.trim(),
      fechaRegistro: new Date().toISOString().split('T')[0],
      status: "activo" as const,
    };

    // Agregar a la convocatoria
    if (!convocatoria.applicants) {
      convocatoria.applicants = [];
    }
    convocatoria.applicants.push(nuevoPostulante);
    convocatoria.applicantsCount = (convocatoria.applicants || []).length;

    toast({
      title: "Postulante registrado",
      description: `Se han enviado las credenciales de acceso al correo ${newPostulante.email}`,
    });

    // Resetear formulario
    setNewPostulante({
      nombres: "",
      apellidos: "",
      tipoDocumento: "Cédula de Ciudadanía",
      numeroDocumento: "",
      email: "",
      telefono: "",
      direccion: "",
    });
    setPostulantDialogOpen(false);
  };

  const aplicantes = convocatoria.applicants || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/convocatorias")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{convocatoria.title}</h1>
          <p className="text-sm text-muted-foreground">Gestión de convocatoria y postulantes</p>
        </div>
      </div>

      {/* Resumen de Convocatoria */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Detalles de la Convocatoria</CardTitle>
              <CardDescription>Información general y cronograma</CardDescription>
            </div>
            <Badge variant={convocatoria.status === "abierta" ? "default" : "secondary"}>
              {convocatoria.status === "abierta" ? "Abierta" : "Cerrada"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{convocatoria.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>Inicio</span>
              </div>
              <p className="font-medium">{convocatoria.startDate}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>Cierre</span>
              </div>
              <p className="font-medium">{convocatoria.endDate}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="h-4 w-4" />
                <span>Postulantes</span>
              </div>
              <p className="font-medium">{aplicantes.length}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Briefcase className="h-4 w-4" />
                <span>Documentos</span>
              </div>
              <p className="font-medium">{convocatoria.requiredDocuments.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentos Requeridos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Requeridos</CardTitle>
          <CardDescription>Lista de entregables obligatorios y opcionales</CardDescription>
        </CardHeader>
        <CardContent>
          {convocatoria.requiredDocuments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No hay documentos definidos</p>
          ) : (
            <div className="space-y-3">
              {convocatoria.requiredDocuments.map((doc) => (
                <div key={doc.id} className="rounded-lg border border-border p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-card-foreground">{doc.name}</h4>
                        <Badge variant={doc.mandatory ? "default" : "secondary"} className="text-xs">
                          {doc.mandatory ? "Obligatorio" : "Opcional"}
                        </Badge>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  {doc.reviewPoints && doc.reviewPoints.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground">Puntos de revisión:</span>
                      <div className="flex flex-wrap gap-1">
                        {doc.reviewPoints.map((rp) => (
                          <Badge key={rp.id} variant="outline" className="text-xs">
                            {rp.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Postulantes Inscritos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Postulantes Inscritos</CardTitle>
              <CardDescription>Personas que han solicitado participar en esta convocatoria</CardDescription>
            </div>
            <Dialog open={postulantDialogOpen} onOpenChange={setPostulantDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Nuevo Postulante
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Registrar Nuevo Postulante</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nombres</Label>
                      <Input
                        placeholder="Juan"
                        value={newPostulante.nombres}
                        onChange={(e) => setNewPostulante({ ...newPostulante, nombres: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Apellidos</Label>
                      <Input
                        placeholder="Pérez García"
                        value={newPostulante.apellidos}
                        onChange={(e) => setNewPostulante({ ...newPostulante, apellidos: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Documento</Label>
                      <select
                        className="w-full h-10 px-3 border border-input rounded-md text-sm"
                        value={newPostulante.tipoDocumento}
                        onChange={(e) => setNewPostulante({ ...newPostulante, tipoDocumento: e.target.value })}
                      >
                        <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                        <option value="PEP">PEP</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Número de Documento</Label>
                      <Input
                        placeholder="1234567890"
                        value={newPostulante.numeroDocumento}
                        onChange={(e) => setNewPostulante({ ...newPostulante, numeroDocumento: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Correo Electrónico</Label>
                    <Input
                      type="email"
                      placeholder="correo@example.com"
                      value={newPostulante.email}
                      onChange={(e) => setNewPostulante({ ...newPostulante, email: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Teléfono</Label>
                      <Input
                        placeholder="3001234567"
                        value={newPostulante.telefono}
                        onChange={(e) => setNewPostulante({ ...newPostulante, telefono: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dirección</Label>
                      <Input
                        placeholder="Calle 10 #20-30"
                        value={newPostulante.direccion}
                        onChange={(e) => setNewPostulante({ ...newPostulante, direccion: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleAddPostulante}>
                    Registrar Postulante
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {aplicantes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12 text-center">
              <Users className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">No hay postulantes registrados</p>
              <p className="mt-1 text-xs text-muted-foreground">Comience registrando al primer postulante</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombres y Apellidos</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aplicantes.map((postulante) => (
                    <TableRow key={postulante.id}>
                      <TableCell className="font-medium">
                        {postulante.nombres} {postulante.apellidos}
                      </TableCell>
                      <TableCell className="text-sm">
                        {postulante.numeroDocumento}
                      </TableCell>
                      <TableCell className="text-sm">{postulante.email}</TableCell>
                      <TableCell className="text-sm">{postulante.telefono}</TableCell>
                      <TableCell className="text-sm">{postulante.fechaRegistro}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {postulante.status === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
