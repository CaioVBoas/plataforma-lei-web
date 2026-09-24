import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { CheckIcon } from './icons';

interface TagProps {
  children: ReactNode;
  /** Marca a competência que a disciplina já cobre. */
  covered?: boolean;
  className?: string;
}

/**
 * Rótulo estático (tema, tipo, competência): sem borda e sem hover, nunca clicável.
 * Assim ele não se confunde com botão secundário, que é o único elemento com borda.
 */
export const Tag = ({ children, covered, className }: TagProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-[13px] leading-tight',
      covered ? 'bg-positive-soft text-positive' : 'bg-fill text-ink-2',
      className,
    )}
  >
    {covered && <CheckIcon size={13} />}
    {children}
  </span>
);
