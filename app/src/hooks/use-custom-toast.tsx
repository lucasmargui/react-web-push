// src/hooks/useCustomToast.ts
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { ReactNode } from "react";

export interface CustomToastData {
  id: string;
  icon?: ReactNode;
  title: string;
  description?: string;
  bgColor?: string;
  duration?: number;
}

type State = {
  toasts: CustomToastData[];
};

const memoryState: State = { toasts: [] };
const listeners: React.Dispatch<React.SetStateAction<State>>[] = [];

function dispatch(toast: CustomToastData, action: "ADD" | "REMOVE") {
  if (action === "ADD") memoryState.toasts.push(toast);
  else memoryState.toasts = memoryState.toasts.filter(t => t.id !== toast.id);

  listeners.forEach(listener => listener({ ...memoryState }));
}

export function useCustomToast() {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  function customToast(toast: Omit<CustomToastData, "id">) {
    const id = uuid();
    const newToast: CustomToastData = { ...toast, id };
    dispatch(newToast, "ADD");

    if (toast.duration !== 0) {
      setTimeout(() => dispatch(newToast, "REMOVE"), toast.duration ?? 5000);
    }

    return id;
  }

  function dismiss(id: string) {
    dispatch({ id } as CustomToastData, "REMOVE");
  }

  return {
    toasts: state.toasts,
    customToast,
    dismiss,
  };
}
