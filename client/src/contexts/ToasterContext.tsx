import { createContext, ReactNode, useContext } from "react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";

type ToastContextType = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  success: (_message: string) => {},
  error: (_message: string) => {},
});

interface ToasterProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToasterProviderProps) {
  const showSuccess = (message: string) => toast.success(message);
  const showError = (message: string) => toast.error(message);

  return (
    <ToastContext.Provider
      value={{
        success: showSuccess,
        error: showError,
      }}
    >
      {children}
      <Toaster position="top-right" closeButton/>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
