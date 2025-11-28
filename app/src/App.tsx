import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import SendNotification from "./pages/SendNotification";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import { registerWorker } from "../public/registerServiceWorker.js"; // função ajustada
import { useToast } from "@/hooks/use-toast";
import { CustomToastContainer } from "@/components/ui/custom-toast-container.js";
import ApiDocumentation  from "./pages/ApiDoc";

const queryClient = new QueryClient();

const App = () => {

  const { toast } = useToast();
  // Registrar Service Worker assim que o App carregar
  useEffect(() => {
   
    if (toast) {
      registerWorker(toast);
    }
    
  }, []);

  

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <CustomToastContainer />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/send" element={<DashboardLayout><SendNotification /></DashboardLayout>} />
            <Route path="/history" element={<DashboardLayout><History /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            <Route path="/profile" element={<DashboardLayout><UserProfile /></DashboardLayout>} />
            <Route path="/api" element={<DashboardLayout><ApiDocumentation /></DashboardLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
