
import { useEffect, useState } from "react";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Clock, Users, TrendingUp, Bell, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPushes, setTotalPushes] = useState(0);
  const [totalActiveNotify, setTotalActivesNotify] = useState(0);
  const [totalActive, setTotalActivesSub] = useState(0);
  const [totalBroadcast, setTotalBroadcast] = useState(0);
  const [totalSingle, setTotalSingle] = useState(0);
  const [totalUrgent, setTotalUrgent] = useState(0);

  const navigate = useNavigate();
  

useEffect(() => {
  const fetchHistory = async () => {
    try {
      // Busca os pushes
// Busca os pushes
    const res = await fetch("https://main-domain-example.online/pushes/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    // Busca as subscriptions
    const resSub = await fetch("https://main-domain-example.online/subscriptions/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

const dataSub = await resSub.json(); // Corrigido: resSub.json() em vez de res.json()


      let usersCount = Object.values(dataSub).length;
      let pushesCount = data.length;
   
      let broadcastCount = 0;
      let singleCount = 0;
      let urgentCount = 0;

      // Converte os valores do objeto em um array
      // Converte o objeto em array
        const subArray: any = Object.values(dataSub);

        // Contagem de notifyActive
        const activeNotifyCount = subArray.filter(sub => sub.notifyActive).length;

        // Contagem de subscriptions ativas
        const activeSubsCount = subArray.reduce((total, sub) => {
          return total + sub.subscriptions.filter(s => s.active).length;
        }, 0);

      data.forEach(item => {
        // Tipo de push
        if (item.pushType === "broadcast") broadcastCount += 1;
        if (item.pushType === "single") singleCount += 1;
        if (item.pushType === "urgent") urgentCount += 1;

      });

      setTotalUsers(usersCount)

      setTotalPushes(pushesCount);
      setTotalActivesNotify(activeNotifyCount);
      setTotalActivesSub(activeSubsCount)

      setTotalBroadcast(broadcastCount);
      setTotalSingle(singleCount);
      setTotalUrgent(urgentCount);

      // Formata os dados para a tabela
      const formattedData = data.map((item) => ({
        id: item.id,
        title: item.payload.title,
        status: item.subscription ? "delivered" : "failed",
        recipients: item.payload.metadata?.length || 0,
        clicks: 0,
        ctr: item.payload.metadata?.length
          ? `${Math.round((item.payload.count / item.payload.metadata.length) * 100)}%`
          : "0%",
        timestamp: item.payload.timestamp
          ? new Date(item.payload.timestamp).toLocaleString()
          : "-",
        type: item.pushType || "single"
      }));

      setHistoryData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      setLoading(false);
    }
  };

  fetchHistory();
}, []);

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
          value={totalPushes} 
          change="+12.5% vs ontem"
          changeType="positive"
          icon={Bell}
          iconColor="text-primary"
        />
        <StatsCard
          title="Total de usuarios ativos"
          value={totalActiveNotify} 
          change="+2.1% vs semana passada"
          changeType="positive"
          icon={CheckCircle2}
          iconColor="text-success"
        />
        <StatsCard
          title="Tolta de dispositivos ativos"
          value={totalActive} 
          change="-1.2% vs semana passada"
          changeType="negative"
          icon={TrendingUp}
          iconColor="text-primary"
        />
        <StatsCard
          title="Usuários"
          value={totalUsers}
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
                { label: "Broadcast", value:  Math.floor((totalBroadcast / historyData.length) * 100), color: "bg-primary" },
                { label: "Single", value: Math.floor((totalSingle / historyData.length) * 100), color: "bg-success" },
                { label: "Urgente", value: Math.floor((totalUrgent / historyData.length) * 100), color: "bg-destructive" },
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
            {historyData.map((notification, index) => (
              <div
                key={index}
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
