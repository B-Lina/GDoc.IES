import { useState } from "react";
import { Upload, Search, Filter, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SemaphoreBadge } from "@/components/SemaphoreBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { documents, type UploadedDocument } from "@/lib/mock-data";

export default function Documentos() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UploadedDocument | null>(null);

  const filtered = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.applicantName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentos</h1>
          <p className="text-sm text-muted-foreground">Revisión y validación documental</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por documento o postulante..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">Documento</th>
                <th className="px-6 py-3">Postulante</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Semáforo</th>
                <th className="px-6 py-3">Confianza OCR</th>
                <th className="px-6 py-3">Validación</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doc.applicantName}</td>
                  <td className="px-6 py-4"><StatusBadge status={doc.status} /></td>
                  <td className="px-6 py-4"><SemaphoreBadge status={doc.semaphore} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-border">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${doc.ocrConfidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{doc.ocrConfidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs capitalize text-muted-foreground">{doc.validationType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(doc)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(doc.status === "pendiente" || doc.status === "en_revision") && (
                        <>
                          <Button variant="ghost" size="sm" className="text-success hover:text-success">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Documento</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Documento</Label>
                  <p className="text-sm font-medium text-foreground">{selected.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Postulante</Label>
                  <p className="text-sm font-medium text-foreground">{selected.applicantName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <div className="mt-1"><StatusBadge status={selected.status} /></div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Semáforo</Label>
                  <div className="mt-1"><SemaphoreBadge status={selected.semaphore} /></div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Confianza OCR</Label>
                  <p className="text-sm font-medium text-foreground">{selected.ocrConfidence}%</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tipo Validación</Label>
                  <p className="text-sm font-medium capitalize text-foreground">{selected.validationType}</p>
                </div>
                {selected.expiryDate && (
                  <div>
                    <Label className="text-muted-foreground">Fecha Vencimiento</Label>
                    <p className="text-sm font-medium text-foreground">{selected.expiryDate}</p>
                  </div>
                )}
              </div>
              {selected.observation && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <Label className="text-destructive">Observación</Label>
                  <p className="mt-1 text-sm text-foreground">{selected.observation}</p>
                </div>
              )}
              {(selected.status === "pendiente" || selected.status === "en_revision") && (
                <div className="space-y-3 border-t border-border pt-4">
                  <Label>Observación (requerida para rechazar)</Label>
                  <Textarea placeholder="Escriba la observación..." />
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="default">
                      <CheckCircle className="mr-2 h-4 w-4" /> Aprobar
                    </Button>
                    <Button className="flex-1" variant="destructive">
                      <XCircle className="mr-2 h-4 w-4" /> Rechazar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
