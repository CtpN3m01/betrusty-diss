// Adaptado de shadcn/ui (https://ui.shadcn.com/docs/components/toast)
import { useState, useEffect, createContext, useContext } from "react";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // En una implementación real, esto lanzaría un error
    // Por ahora, proporcionamos una implementación simulada
    return {
      toast: (props: Omit<Toast, "id">) => {
        console.log("Toast (simulado):", props);
        alert(`${props.title}: ${props.description}`);
      }
    };
  }
  return context;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, ...props };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    if (props.duration !== Infinity) {
      setTimeout(() => {
        dismiss(id);
      }, props.duration || 5000);
    }
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export { ToastProvider as Provider, ToastContext as Context }; 