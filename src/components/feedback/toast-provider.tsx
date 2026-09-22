import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type ToastAction } from './toast-context';

const TOAST_DURATION_MS = 4500;

interface ToastState {
  id: number;
  message: string;
  action?: ToastAction;
}

/** Um toast por vez no canto inferior direito; o mais recente substitui o anterior. */
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
      <div aria-live="polite" className="pointer-events-none fixed right-6 bottom-6 z-80">
        {toast && (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex max-w-[420px] items-center gap-3.5 rounded-lg bg-n-800 px-4 py-3.5 shadow-popover animate-toast-entra"
          >
            <p className="text-sm leading-snug text-n-0">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  setToast(null);
                  toast.action?.onClick();
                }}
                className="h-[34px] shrink-0 rounded-full border border-n-300 bg-n-0 px-[13px] text-[13px] font-medium text-n-600 hover:bg-n-50"
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
