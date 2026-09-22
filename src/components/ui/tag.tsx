import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { CheckIcon } from './icons';

interface TagProps {
  children: ReactNode;
  /** Marca a competência que a disciplina já cobre. */
  covered?: boolean;
  className?: string;
}

export const Tag = ({ children, covered, className }: TagProps) => (
  <span
    className={cn(
      'inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[13px]',
      covered ? 'bg-positive-soft text-positive' : 'bg-fill text-ink-2',
      className,
    )}
  >
    {covered && <CheckIcon size={13} />}
    {children}
  </span>
);
