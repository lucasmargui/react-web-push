import { LayoutDashboard, Send, History, Settings, Bell, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";

import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import NotificationStatus from "@/components/ui/status-active";


const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Enviar Notificação", url: "/send", icon: Send },
  { title: "Histórico", url: "/history", icon: History },
  { title: "Configurações", url: "/settings", icon: Settings },
  { title: "Profile", url: "/userprofile", icon: User },
  { title: "Api", url: "/api", icon: User }
];

export function AppSidebar({active, setActive}) {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={open ? "w-60" : "w-14"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Bell className="h-4 w-4 text-primary-foreground" />
            </div>
            {open && (
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-foreground">NotifyHub</span>
                <span className="text-xs text-muted-foreground">v1.0.0</span>
              </div>
            )}
          </div>
        </div>
        <NotificationStatus active={active} setActive={setActive}/>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-accent"
                      activeClassName="bg-accent text-primary font-medium"
                    >
                      <item.icon className={open ? "mr-2 h-4 w-4" : "h-4 w-4"} />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-border">
          {open && (
            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Status: <span className="text-success">Online</span></p>
              <p>Última atualização: Agora</p>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
