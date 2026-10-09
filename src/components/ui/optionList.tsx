import { useId, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { CheckIcon } from './icons';
import { withIconVariant } from './iconVariant';

export interface OptionListOption<T extends string> {
  value: T;
  label: string;
  icon: ReactNode;
  description?: string;
}

interface OptionListProps<T extends string> {
  label: string;
  value: T;
  options: OptionListOption<T>[];
  onChange: (value: T) => void;
  /** Duas colunas a partir do tablet. */
  columns?: 1 | 2;
}

/**
 * Lista de opções sempre aberta, no lugar de um menu suspenso: cada opção
 * com ícone, o nome e, se precisar, uma linha de explicação. A escolhida
 * ganha borda petróleo e o check, como na lista do menu.
 */
export const OptionList = <T extends string>({ label, value, options, onChange, columns = 2 }: OptionListProps<T>) => {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cn('grid gap-2', columns === 2 && 'sm:grid-cols-2')}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              'flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors duration-100 focus-within:ring-2 focus-within:ring-accent/40',
              selected ? 'border-brand bg-brand-50' : 'border-line-strong bg-surface hover:border-ink-3',
            )}
          >
            <input type="radio" name={name} value={option.value} checked={selected} onChange={() => onChange(option.value)} className="sr-only" />
            <span
              aria-hidden="true"
              className={cn('flex size-10 shrink-0 items-center justify-center rounded-md', selected ? 'bg-brand text-white' : 'bg-fill text-ink-2')}
            >
              {withIconVariant(option.icon, selected)}
            </span>
            <span className="min-w-0 flex-1">
              <span className={cn('block text-body text-ink', selected && 'font-semibold')}>{option.label}</span>
              {option.description && <span className="mt-0.5 block text-small text-ink-2">{option.description}</span>}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full border',
                selected ? 'border-brand bg-brand text-white' : 'border-line-strong bg-surface',
              )}
            >
              {selected && <CheckIcon size={14} strokeWidth={2.2} />}
            </span>
          </label>
        );
      })}
    </div>
  );
};
