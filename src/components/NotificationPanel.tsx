import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationPreview } from "./NotificationPreview";
import { Send, Upload, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Metadata {
  id: string;
  role: string;
}

export const NotificationPanel = () => {
  const { toast } = useToast();
  const [notificationType, setNotificationType] = useState<"single" | "broadcast">("single");
  const [recipientId, setRecipientId] = useState("1");
  const [title, setTitle] = useState("Teste");
  const [subtitle, setBody] = useState("teste");
  const [icon, setIcon] = useState("img/codigo-qr.png");
  const [image, setImage] = useState("img/formulario.png");
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#03c903ff");
  const [urgent, setUrgent] = useState(false);
  const [count, setCount] = useState(1);
  const [metadata, setMetadata] = useState<Metadata[]>([{ id: "", role: "" }]);
  const [sending, setSending] = useState(false);

  const generateTag = () => {
    const timestamp = Date.now();
    return `invite-${recipientId || "broadcast"}-${timestamp}`;
  };

  const addMetadata = () => {
    setMetadata([...metadata, { id: "", role: "" }]);
  };

  const removeMetadata = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index));
  };

  const updateMetadata = (index: number, field: keyof Metadata, value: string) => {
    const newMetadata = [...metadata];
    newMetadata[index][field] = value;
    setMetadata(newMetadata);
  };

  const validateForm = () => {
    if (notificationType === "single" && !recipientId.trim()) {
      toast({
        title: "Erro de validação",
        description: "ID do destinatário é obrigatório para notificação single.",
        variant: "destructive",
      });
      return false;
    }

    if (!title.trim()) {
      toast({
        title: "Erro de validação",
        description: "Título é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    if (!subtitle.trim()) {
      toast({
        title: "Erro de validação",
        description: "Corpo da mensagem é obrigatório.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSendNotification = async () => {
    if (!validateForm()) return;

    setSending(true);

     
     const id = recipientId;

      const payload = {
          title: title, 
          body: subtitle, 
          icon: icon, 
          image: image, 
          tag: generateTag(), 
          url: url, 
          color: color,
          urgent: urgent,
          count: count, 
          metadata: metadata
      };

      const body = { ids: [id], payload, pushType: 'single'};
      
      console.log(body, [id], 'single')

      const response = await fetch('http://localhost:7000/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
      });

    


    setTimeout(() => {
      console.log("Notificação enviada:", payload);

      setSending(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Enviar Notificação</h1>
        <p className="text-muted-foreground">Configure e envie notificações personalizadas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <Card>
          <CardHeader>
            <CardTitle>Configuração da Notificação</CardTitle>
            <CardDescription>Preencha os campos abaixo para criar sua notificação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de Notificação */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Notificação *</Label>
              <Select value={notificationType} onValueChange={(value: "single" | "broadcast") => setNotificationType(value)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single (Um destinatário)</SelectItem>
                  <SelectItem value="broadcast">Broadcast (Todos)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ID do Destinatário */}
            {notificationType === "single" && (
              <div className="space-y-2">
                <Label htmlFor="recipientId">ID do Destinatário *</Label>
                <Input
                  id="recipientId"
                  placeholder="Ex: user-123"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                />
              </div>
            )}

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ex: Nova mensagem"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">{title.length}/60 caracteres</p>
            </div>

            {/* Corpo */}
            <div className="space-y-2">
              <Label htmlFor="body">Corpo da Mensagem *</Label>
              <Textarea
                id="body"
                placeholder="Ex: Você recebeu uma nova mensagem..."
                value={subtitle}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">{subtitle.length}/200 caracteres</p>
            </div>

            {/* Ícone */}
            <div className="space-y-2">
              <Label htmlFor="icon">URL do Ícone</Label>
              <div className="flex gap-2">
                <Input
                  id="icon"
                  placeholder="https://exemplo.com/icone.png"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                />
                <Button variant="outline" size="icon" type="button">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Imagem */}
            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <Button variant="outline" size="icon" type="button">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* URL de destino */}
            <div className="space-y-2">
              <Label htmlFor="url">URL de Destino</Label>
              <Input
                id="url"
                placeholder="https://exemplo.com/destino"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {/* Cor */}
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Urgente e Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="count">Contagem</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                />
              </div>

              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    id="urgent"
                    checked={urgent}
                    onCheckedChange={(checked) => setUrgent(checked as boolean)}
                  />
                  <span className="text-sm font-medium">Urgente</span>
                </label>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Metadata</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMetadata}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              {metadata.map((meta, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="ID"
                    value={meta.id}
                    onChange={(e) => updateMetadata(index, "id", e.target.value)}
                  />
                  <Input
                    placeholder="Role"
                    value={meta.role}
                    onChange={(e) => updateMetadata(index, "role", e.target.value)}
                  />
                  {metadata.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeMetadata(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Botão Enviar */}
            <Button
              onClick={handleSendNotification}
              disabled={sending}
              className="w-full"
              size="lg"
            >
              {sending ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Notificação
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Veja como sua notificação ficará</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationPreview
                title={title}
                body={subtitle}
                icon={icon}
                image={image}
                color={color}
                urgent={urgent}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
