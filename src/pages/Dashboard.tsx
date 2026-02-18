import { FileText, Users, ClipboardList, CheckCircle, XCircle, Clock, CircleDot } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { SemaphoreBadge } from "@/components/SemaphoreBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { dashboardStats, documents, convocatorias } from "@/lib/mock-data";

export default function Dashboard() {
  const recentDocs = documents.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen general del sistema G-Doc IES</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Convocatorias Activas" value={dashboardStats.activeConvocatorias} icon={ClipboardList} description={`${dashboardStats.totalConvocatorias} en total`} />
        <StatCard title="Documentos Cargados" value={dashboardStats.totalDocuments} icon={FileText} description={`${dashboardStats.pendingReview} pendientes de revisión`} />
        <StatCard title="Aprobados" value={dashboardStats.approved} icon={CheckCircle} iconClassName="bg-success/10 text-success" />
        <StatCard title="Postulantes" value={dashboardStats.totalApplicants} icon={Users} />
      </div>

      {/* Semaphore Summary */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">Semáforo Inteligente</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-lg border border-border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semaphore-green/10">
              <CircleDot className="h-6 w-6 text-semaphore-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{dashboardStats.semaphoreGreen}</p>
              <p className="text-sm text-muted-foreground">Vigentes</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semaphore-yellow/10">
              <CircleDot className="h-6 w-6 text-semaphore-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{dashboardStats.semaphoreYellow}</p>
              <p className="text-sm text-muted-foreground">Con dudas</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-border p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-semaphore-red/10">
              <CircleDot className="h-6 w-6 text-semaphore-red" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{dashboardStats.semaphoreRed}</p>
              <p className="text-sm text-muted-foreground">Vencidos / Ilegibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-card-foreground">Documentos Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">Documento</th>
                <th className="px-6 py-3">Postulante</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Semáforo</th>
                <th className="px-6 py-3">OCR</th>
                <th className="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{doc.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doc.applicantName}</td>
                  <td className="px-6 py-4"><StatusBadge status={doc.status} /></td>
                  <td className="px-6 py-4"><SemaphoreBadge status={doc.semaphore} /></td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doc.ocrConfidence}%</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doc.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
