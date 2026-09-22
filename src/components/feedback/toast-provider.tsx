import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type ToastAction } from './toast-context';

const TOAST_DURATION_MS = 4500;

interface ToastState {
  id: number;
  message: string;
  action?: ToastAction;
}

/** Um aviso por vez, centralizado no topo, longe das barras fixas de ação; o mais recente substitui o anterior. */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = useCallback((message: string, action?: ToastAction) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, action });
    timer.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-5 z-[60] flex justify-center px-4">
        {toast && (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex max-w-[480px] items-center gap-4 rounded-lg bg-ink px-4 py-3 shadow-popover animate-rise-in"
          >
            <p className="text-sm leading-snug text-white">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  setToast(null);
                  toast.action?.onClick();
                }}
                className="shrink-0 text-sm font-semibold text-accent-on-dark hover:text-white"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
};
