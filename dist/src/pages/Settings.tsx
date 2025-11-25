import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Bell, Lock, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "✓ Configurações salvas!",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as configurações do sistema de notificações
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>Configurações Gerais</CardTitle>
          </div>
          <CardDescription>Configurações básicas do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="app-name">Nome da Aplicação</Label>
            <Input id="app-name" defaultValue="NotifyHub" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-icon">URL do Ícone Padrão</Label>
            <Input
              id="default-icon"
              placeholder="https://exemplo.com/icon.png"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações de Teste</Label>
              <p className="text-sm text-muted-foreground">
                Habilitar modo de teste para notificações
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-retry em Falhas</Label>
              <p className="text-sm text-muted-foreground">
                Tentar reenviar automaticamente notificações que falharam
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Preferências de Notificação</CardTitle>
          </div>
          <CardDescription>Configure como as notificações são enviadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="default-color">Cor Padrão</Label>
            <div className="flex gap-2">
              <Input
                id="default-color"
                type="color"
                defaultValue="#3B82F6"
                className="w-20 h-10"
              />
              <Input defaultValue="#3B82F6" className="flex-1" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-retry">Máximo de Tentativas</Label>
            <Input id="max-retry" type="number" defaultValue="3" min="1" max="10" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Confirmar Antes de Enviar</Label>
              <p className="text-sm text-muted-foreground">
                Solicitar confirmação antes de enviar notificações em broadcast
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações Urgentes</Label>
              <p className="text-sm text-muted-foreground">
                Permitir envio de notificações urgentes
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Coletar dados de engajamento e cliques
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <CardTitle>Segurança</CardTitle>
          </div>
          <CardDescription>Configurações de segurança e API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="api-key">Chave da API</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                defaultValue="sk_test_1234567890abcdef"
                className="flex-1"
              />
              <Button variant="outline">Gerar Nova</Button>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Autenticação de Dois Fatores</Label>
              <p className="text-sm text-muted-foreground">
                Adicionar camada extra de segurança
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Logs de Auditoria</Label>
              <p className="text-sm text-muted-foreground">
                Registrar todas as ações no sistema
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default Settings;
