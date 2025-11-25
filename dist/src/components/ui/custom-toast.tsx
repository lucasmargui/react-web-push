// src/components/ui/CustomToast.tsx
import * as React from "react";
import { Toast, ToastTitle, ToastDescription, ToastClose } from "./toast"; // seu Toast existente
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomToastProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  bgColor?: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export const CustomToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  CustomToastProps
>(({ icon, title, description, bgColor, className, onOpenChange, ...props }, ref) => {
  return (
    <Toast
      ref={ref}
      className={cn("flex items-start space-x-4 p-4 rounded-md shadow-lg", className)}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      {...props}
      onOpenChange={onOpenChange}
    >
      {icon && <div className="mt-1">{icon}</div>}

      <div className="flex-1 space-y-1">
        <ToastTitle className="text-sm font-semibold">{title}</ToastTitle>
        {description && (
          <ToastDescription className="text-sm opacity-90">{description}</ToastDescription>
        )}
      </div>

      <ToastClose>
        <X className="h-4 w-4" />
      </ToastClose>
    </Toast>
  );
});

CustomToast.displayName = "CustomToast";
