import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { CheckIcon } from './icons';

interface ToggleChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  selected: boolean;
  /** Mostra o check à esquerda quando ativo, reforçando o estado além da cor. */
  showCheck?: boolean;
  size?: 'sm' | 'md';
}

export const ToggleChip = ({ selected, showCheck = true, size = 'md', className, children, ...props }: ToggleChipProps) => (
  <button
    type="button"
    aria-pressed={selected}
    className={cn(
      'inline-flex items-center gap-2 rounded-full border font-medium transition-colors duration-200',
      size === 'md' ? 'h-10 px-3.5 text-sm' : 'h-[34px] px-[13px] text-[13px]',
      selected ? 'bg-azul-50 border-azul-500 text-azul-800' : 'bg-n-0 border-n-300 text-n-700 hover:bg-n-50',
      className,
    )}
    {...props}
  >
    {selected && showCheck && <CheckIcon size={13} />}
    {children}
  </button>
);
