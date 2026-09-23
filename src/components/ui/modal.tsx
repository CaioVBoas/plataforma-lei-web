import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';

/** Escape fecha e o scroll da página fica travado enquanto a janela está aberta. */
const useModalBehavior = (onClose: () => void) => {
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

interface ModalProps {
  title: string;
  description?: ReactNode;
  onClose: () => void;
  footer: ReactNode;
  children?: ReactNode;
  size?: 'md' | 'lg';
}

/** Janela centralizada para confirmar uma decisão sem sair da tela atual. */
export const Modal = ({ title, description, onClose, footer, children, size = 'md' }: ModalProps) => {
  const titleId = useId();
  useModalBehavior(onClose);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/25 animate-fade-in" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative flex max-h-full w-full flex-col overflow-hidden rounded-lg bg-surface shadow-sheet animate-sheet-in',
          size === 'md' ? 'max-w-[480px]' : 'max-w-[600px]',
        )}
      >
        <header className="px-6 pt-6">
          <h2 id={titleId} className="text-headline">
            {title}
          </h2>
          {description && <div className="mt-1.5 text-sm leading-relaxed text-ink-2">{description}</div>}
        </header>
        {children && <div className="overflow-y-auto px-6 pt-5 pb-1">{children}</div>}
        <footer className="flex flex-wrap items-center justify-end gap-2 px-6 pt-6 pb-5">{footer}</footer>
      </section>
    </div>,
    document.body,
  );
};
