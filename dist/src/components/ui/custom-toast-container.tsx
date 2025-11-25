// src/components/ui/CustomToastContainer.tsx
import { ToastProvider, ToastViewport } from "./toast"; // seu Toast existente
import { CustomToast } from "./custom-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

export const CustomToastContainer = () => {
  const { toasts, dismiss } = useCustomToast();

  return (
    <ToastProvider>
      <ToastViewport>
        {toasts.map(toast => (
          <CustomToast
            key={toast.id}
            icon={toast.icon}
            title={toast.title}
            description={toast.description}
            bgColor={toast.bgColor}
            onOpenChange={(open) => !open && dismiss(toast.id)}
          />
        ))}
      </ToastViewport>
    </ToastProvider>
  );
};
