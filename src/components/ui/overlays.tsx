import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { CloseIcon } from './icons';

/** Escape fecha e o scroll da página fica travado enquanto a camada está aberta. */
const useOverlayBehavior = (onClose: () => void) => {
  // A ref evita reinstalar o listener a cada render quando o chamador passa uma função nova.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

const Veil = ({ onClose }: { onClose: () => void }) => (
  <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-n-900/30 animate-veu-entra" />
);

interface SidePanelProps {
  title: ReactNode;
  onClose: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/** Painel lateral de 480px: a versão desktop do bottom sheet do Design System. */
export const SidePanel = ({ title, onClose, header, footer, children }: SidePanelProps) => {
  const titleId = useId();
  useOverlayBehavior(onClose);

  return createPortal(
    <div className="fixed inset-0 z-60 flex justify-end">
      <Veil onClose={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-full w-[480px] max-w-full flex-col rounded-l-[20px] bg-n-0 shadow-popover animate-painel-entra"
      >
        <header className="border-b border-n-200 px-6 pt-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="heading-section leading-[1.3]">
              {title}
            </h2>
            <button
              type="button"
              aria-label="Fechar"
              onClick={onClose}
              autoFocus
              className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-n-300 bg-n-0 text-n-600 hover:bg-n-50"
            >
              <CloseIcon size={14} strokeWidth={2} />
            </button>
          </div>
          {header}
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="border-t border-n-200 px-6 py-4">{footer}</footer>}
      </section>
    </div>,
    document.body,
  );
};

interface ModalProps {
  title: string;
  onClose: () => void;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ title, onClose, footer, children, className }: ModalProps) => {
  const titleId = useId();
  useOverlayBehavior(onClose);

  return createPortal(
    <div className="fixed inset-0 z-70 flex items-center justify-center p-10">
      <Veil onClose={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn('relative max-h-full w-[560px] overflow-y-auto rounded-xl bg-n-0 shadow-popover', className)}
      >
        <div className="px-6 pt-6">
          <h2 id={titleId} className="mb-6 text-xl font-bold text-n-800">
            {title}
          </h2>
          {children}
        </div>
        <footer className="mt-6 flex items-center justify-end gap-2.5 border-t border-n-200 px-6 py-4">{footer}</footer>
      </section>
    </div>,
    document.body,
  );
};
