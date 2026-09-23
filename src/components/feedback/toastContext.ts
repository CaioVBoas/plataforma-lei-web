import { createContext, useContext } from 'react';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastApi {
  show: (message: string, action?: ToastAction) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast precisa estar dentro de <ToastProvider>.');
  return context;
};
