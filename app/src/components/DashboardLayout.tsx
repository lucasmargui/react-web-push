import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import NotificationBanner from "@/components/ui/banner";


interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  
  const [active, setActive] = useState(null);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar active={active} setActive={setActive}/>
        <div className="flex-1 flex flex-col">
      
          <header className="h-16 border-b border-border bg-card flex items-center px-6 sticky top-0 z-10 backdrop-blur-sm bg-card/80">
          
            <SidebarTrigger className="mr-4" />
           
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                Sistema de Notificações
                 
              </h2>
            </div>
          </header>
        
          {/* Botão para ativar notificações */}
          <NotificationBanner setActive={setActive} />
          
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};