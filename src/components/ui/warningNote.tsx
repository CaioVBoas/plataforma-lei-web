import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { InfoIcon } from './icons';

interface WarningNoteProps {
  title?: ReactNode;
  children?: ReactNode;
  /** alert quando aparece por causa de uma escolha da pessoa, para o leitor de tela anunciar. */
  role?: 'alert' | 'status';
  className?: string;
}

/**
 * Aviso que pede atenção sem gritar: fundo neutro, faixa amarela à esquerda,
 * ícone e título em amarelo escuro. Amarelo nunca é fundo.
 */
export const WarningNote = ({ title, children, role, className }: WarningNoteProps) => (
  <div role={role} className={cn('flex gap-3 rounded-lg border border-line border-l-4 border-l-caution bg-surface px-5 py-4', className)}>
    <InfoIcon size={20} className="mt-0.5 shrink-0 text-caution" />
    <div className="min-w-0 flex-1">
      {title && <p className="text-body font-semibold text-caution">{title}</p>}
      {children && <div className={cn('text-small text-ink', title ? 'mt-1' : undefined)}>{children}</div>}
    </div>
  </div>
);
