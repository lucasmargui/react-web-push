import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Clock, Users, TrendingUp, Bell, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const recentNotifications = [
  {
    id: 1,
    title: "Promoção de Black Friday",
    type: "broadcast",
    status: "sent",
    recipients: "12.5k",
    timestamp: "5 min atrás",
  },
  {
    id: 2,
    title: "Atualização de pedido",
    type: "single",
    status: "sent",
    recipients: "1",
    timestamp: "15 min atrás",
  },
  {
    id: 3,
    title: "Lembrete de carrinho",
    type: "single",
    status: "sent",
    recipients: "1",
    timestamp: "1 hora atrás",
  },
  {
    id: 4,
    title: "Nova funcionalidade",
    type: "broadcast",
    status: "sent",
    recipients: "8.2k",
    timestamp: "2 horas atrás",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do sistema de notificações
          </p>
        </div>
        <Button onClick={() => navigate("/send")} size="lg" className="gap-2">
          <Send className="h-4 w-4" />
          Nova Notificação
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Enviado (Hoje)"
          value="2,345"
          change="+12.5% vs ontem"
          changeType="positive"
          icon={Bell}
          iconColor="text-primary"
        />
        <StatsCard
          title="Taxa de Entrega"
          value="98.5%"
          change="+2.1% vs semana passada"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="text-success"
        />
        <StatsCard
          title="Taxa de Cliques"
          value="24.8%"
          change="-1.2% vs semana passada"
          changeType="negative"
          icon={TrendingUp}
          iconColor="text-primary"
        />
        <StatsCard
          title="Usuários Ativos"
          value="18.2k"
          change="+3.4% vs mês passado"
          changeType="positive"
          icon={Users}
          iconColor="text-primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade dos Últimos 7 Dias</CardTitle>
            <CardDescription>Volume de notificações enviadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around gap-2">
              {[65, 85, 72, 90, 78, 95, 88].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary rounded-t-md transition-all hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Engajamento</CardTitle>
            <CardDescription>Porcentagem de notificações abertas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Broadcast", value: 78, color: "bg-primary" },
                { label: "Single", value: 92, color: "bg-success" },
                { label: "Urgente", value: 95, color: "bg-destructive" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notificações Recentes</CardTitle>
              <CardDescription>Últimas notificações enviadas</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/history")}>
              Ver Todas
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{notification.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="capitalize">{notification.type}</span>
                      <span>•</span>
                      <span>{notification.recipients} destinatários</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Enviado</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
