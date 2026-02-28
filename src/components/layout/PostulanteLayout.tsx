import { Outlet } from "react-router-dom";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PostulanteLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">G-Doc IES</h1>
              <p className="text-xs text-muted-foreground">Portal del Postulante</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Centered Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <p className="text-center text-xs text-muted-foreground">
          Universidad de Cundinamarca — Sistema de Gestión Documental
        </p>
      </footer>
    </div>
  );
}
