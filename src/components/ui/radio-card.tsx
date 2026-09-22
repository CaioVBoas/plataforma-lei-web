import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface RadioCardProps {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  aside?: ReactNode;
  rounded?: 'lg' | '2xl';
}

/** Opção de escolha única com a área inteira clicável e o círculo de rádio como reforço visual. */
export const RadioCard = ({ selected, onSelect, children, aside, rounded = 'lg' }: RadioCardProps) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={cn(
      'flex w-full items-center gap-3.5 border px-[18px] py-4 text-left transition-colors',
      rounded === 'lg' ? 'rounded-lg' : 'rounded-2xl',
      selected ? 'border-azul-500 bg-azul-50' : 'border-n-300 bg-n-0 hover:bg-n-50',
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        'size-[18px] shrink-0 rounded-full border-2',
        selected ? 'border-azul-500 shadow-[inset_0_0_0_3.5px_#fff,inset_0_0_0_9px_var(--color-azul-500)]' : 'border-n-300',
      )}
    />
    <span className="min-w-0 flex-1">{children}</span>
    {aside}
  </button>
);
