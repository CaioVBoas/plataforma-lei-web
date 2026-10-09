import type { ReactNode } from 'react';
import { TrayIcon } from './icons';

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  /** Ícone de 48px em duotone; por padrão, a caixa vazia. */
  icon?: ReactNode;
}

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => (
  <div className="rounded-lg border border-fact-line bg-fact px-6 py-12 text-center">
    <span aria-hidden="true" className="mb-4 flex justify-center text-brand">
      {icon ?? <TrayIcon size={48} variant="duotone" />}
    </span>
    <p className="text-h4">{title}</p>
    {description && <p className="mx-auto mt-1.5 max-w-[52ch] text-small text-ink-2">{description}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);
