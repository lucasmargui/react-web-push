import { Bell } from "lucide-react";

interface NotificationPreviewProps {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  color?: string;
  urgent?: boolean;
}

export const NotificationPreview = ({
  title,
  body,
  icon,
  image,
  color = "#3B82F6",
  urgent,
}: NotificationPreviewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Preview da Notificação</h3>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
        <div className="flex items-start gap-3">
          {icon ? (
            <img src={icon} alt="Icon" className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              <Bell className="h-5 w-5 text-white" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm leading-tight">
                  {title || "Título da Notificação"}
                </p>
                <p className="text-sm text-muted-foreground mt-1 leading-tight">
                  {body || "Corpo da notificação aparece aqui"}
                </p>
              </div>
              {urgent && (
                <span className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  Urgente
                </span>
              )}
            </div>

            {image && (
              <img
                src={image}
                alt="Notification"
                className="mt-3 rounded-md w-full h-32 object-cover"
              />
            )}

            <p className="text-xs text-muted-foreground mt-2">Agora mesmo</p>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 border border-border rounded-lg p-3">
        <p className="text-xs text-muted-foreground text-center">
          Esta é uma visualização aproximada. A aparência real pode variar por dispositivo.
        </p>
      </div>
    </div>
  );
};
