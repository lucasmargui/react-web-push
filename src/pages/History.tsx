import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Bell, CheckCircle2, XCircle } from "lucide-react";

const historyData = [
  {
    id: "1",
    title: "Promoção de Black Friday",
    type: "broadcast",
    status: "delivered",
    recipients: "12,543",
    clicks: "3,127",
    ctr: "24.9%",
    timestamp: "2024-01-15 14:30",
  },
  {
    id: "2",
    title: "Atualização de pedido #9482",
    type: "single",
    status: "delivered",
    recipients: "1",
    clicks: "1",
    ctr: "100%",
    timestamp: "2024-01-15 14:15",
  },
  {
    id: "3",
    title: "Lembrete de carrinho abandonado",
    type: "single",
    status: "delivered",
    recipients: "1",
    clicks: "0",
    ctr: "0%",
    timestamp: "2024-01-15 13:00",
  },
  {
    id: "4",
    title: "Nova funcionalidade disponível",
    type: "broadcast",
    status: "delivered",
    recipients: "8,234",
    clicks: "2,045",
    ctr: "24.8%",
    timestamp: "2024-01-15 12:00",
  },
  {
    id: "5",
    title: "Confirmação de cadastro",
    type: "single",
    status: "delivered",
    recipients: "1",
    clicks: "1",
    ctr: "100%",
    timestamp: "2024-01-15 11:30",
  },
  {
    id: "6",
    title: "Alerta de segurança",
    type: "broadcast",
    status: "failed",
    recipients: "15,234",
    clicks: "0",
    ctr: "0%",
    timestamp: "2024-01-15 10:00",
  },
];

const History = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Histórico de Notificações</h1>
        <p className="text-muted-foreground mt-1">
          Visualize e analise todas as notificações enviadas
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar notificações..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="broadcast">Broadcast</SelectItem>
                <SelectItem value="single">Single</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">Todos os status</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Notificações</CardTitle>
          <CardDescription>Histórico completo de envios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {historyData.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant={item.type === "broadcast" ? "default" : "secondary"}>
                        {item.type}
                      </Badge>
                      {item.status === "delivered" ? (
                        <Badge variant="outline" className="text-success border-success">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Entregue
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-destructive border-destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Falhou
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Destinatários</p>
                    <p className="font-semibold text-foreground">{item.recipients}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Cliques</p>
                    <p className="font-semibold text-foreground">{item.clicks}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">CTR</p>
                    <p className="font-semibold text-foreground">{item.ctr}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs">Enviado em</p>
                    <p className="font-medium text-foreground">{item.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium text-foreground">1-6</span> de{" "}
              <span className="font-medium text-foreground">247</span> notificações
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Anterior
              </Button>
              <Button variant="outline" size="sm">
                Próxima
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
