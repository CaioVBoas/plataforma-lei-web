import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface ChoiceBarOption<T extends string> {
  value: T;
  label: string;
  icon: ReactNode;
  count?: number;
}

interface ChoiceBarProps<T extends string> {
  label: string;
  value: T;
  options: ChoiceBarOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Escolha lado a lado, com ícone e contagem em cada opção, como "Dias,
 * Semanas, Meses": todas as opções ficam à vista, sem menu para abrir.
 * No celular viram uma grade de duas colunas, com alvos grandes.
 */
export const ChoiceBar = <T extends string>({ label, value, options, onChange, className }: ChoiceBarProps<T>) => (
  <div role="radiogroup" aria-label={label} className={cn('grid grid-cols-2 gap-1 rounded-xl bg-fill p-1 sm:inline-flex sm:flex-wrap', className)}>
    {options.map((option) => {
      const selected = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(option.value)}
          className={cn(
            'flex min-h-11 items-center gap-2 rounded-lg px-3.5 text-left text-[15px] transition-colors duration-100',
            selected ? 'bg-surface font-semibold text-ink shadow-[0_1px_3px_rgba(10,50,50,0.12)]' : 'text-ink-2 hover:bg-surface/60 hover:text-ink',
          )}
        >
          <span aria-hidden="true" className={cn('shrink-0', selected ? 'text-brand' : 'text-ink-3')}>
            {option.icon}
          </span>
          <span className="min-w-0 flex-1 truncate">{option.label}</span>
          {option.count !== undefined && (
            <span
              className={cn(
                'min-w-6 shrink-0 rounded-full px-1.5 text-center text-[13px] font-semibold tabular-nums',
                selected ? 'bg-brand text-white' : 'bg-surface text-ink-2',
              )}
            >
              {option.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);
