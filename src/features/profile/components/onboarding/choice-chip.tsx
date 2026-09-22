import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ChoiceChipProps {
  selected: boolean;
  onToggle: () => void;
  /** "Recusa" usa neutro em vez de azul: marcar o que não conduz não é uma conquista. */
  tone?: 'accept' | 'decline';
  children: ReactNode;
}

export const ChoiceChip = ({ selected, onToggle, tone = 'accept', children }: ChoiceChipProps) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onToggle}
    className={cn(
      'h-[34px] rounded-full border px-[13px] text-[13px] font-medium transition-colors',
      !selected && 'border-n-300 bg-n-0 hover:bg-n-50',
      !selected && (tone === 'accept' ? 'text-n-700' : 'text-n-500'),
      selected && tone === 'accept' && 'border-azul-500 bg-azul-500 text-n-0',
      selected && tone === 'decline' && 'border-n-400 bg-n-100 text-n-600',
    )}
  >
    {children}
  </button>
);
