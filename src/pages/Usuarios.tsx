import { Shield, UserCheck, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@/lib/mock-data";

const mockUsers = [
  { id: "1", name: "Carlos Rodríguez", email: "carlos@udec.edu.co", role: "admin" as Role },
  { id: "2", name: "Laura Sánchez", email: "laura@udec.edu.co", role: "revisor" as Role },
  { id: "3", name: "Pedro Ramírez", email: "pedro@udec.edu.co", role: "revisor" as Role },
  { id: "4", name: "María García", email: "maria.garcia@email.com", role: "postulante" as Role },
  { id: "5", name: "Juan López", email: "juan.lopez@email.com", role: "postulante" as Role },
  { id: "6", name: "Ana Martínez", email: "ana.martinez@email.com", role: "postulante" as Role },
];

const roleConfig: Record<Role, { icon: typeof Shield; label: string }> = {
  admin: { icon: Shield, label: "Administrador" },
  revisor: { icon: UserCheck, label: "Revisor" },
  postulante: { icon: GraduationCap, label: "Postulante" },
};

export default function Usuarios() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
        <p className="text-sm text-muted-foreground">Gestión de usuarios y roles del sistema</p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockUsers.map((user) => {
                const config = roleConfig[user.role];
                const Icon = config.icon;
                return (
                  <tr key={user.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="gap-1">
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
