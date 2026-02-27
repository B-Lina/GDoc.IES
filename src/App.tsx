import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Convocatorias from "./pages/Convocatorias";
import NuevaConvocatoria from "./pages/NuevaConvocatoria";
import Documentos from "./pages/Documentos";
import Expedientes from "./pages/Expedientes";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/convocatorias" element={<Convocatorias />} />
            <Route path="/convocatorias/nueva" element={<NuevaConvocatoria />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/expedientes" element={<Expedientes />} />
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
