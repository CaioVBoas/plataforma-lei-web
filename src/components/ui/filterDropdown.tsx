import type { ReactNode } from 'react';
import { useFlipToFit } from '@/hooks/useFlipToFit';
import { usePopover } from '@/hooks/usePopover';
import { cn } from '@/utils/cn';
import { CheckIcon, ChevronDownIcon } from './icons';

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  /** Contagem à direita, como "3", para a pessoa saber o que vai achar. */
  count?: number;
}

interface FilterDropdownProps<T extends string> {
  /** O que o filtro escolhe: "Mostrar", "Demanda", "Docente". */
  label: string;
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
  icon?: ReactNode;
  className?: string;
}

/** Botão e painel dos filtros da linha de filtragem: o mesmo desenho do seletor de mês. */
export const FILTER_BUTTON =
  'flex h-11 w-full items-center gap-2 rounded-lg border border-line-strong bg-surface px-3.5 text-left text-label text-ink transition-colors hover:border-ink-3 sm:w-auto';
export const FILTER_PANEL = 'absolute top-full z-40 mt-2 rounded-xl border border-line bg-surface p-1.5 shadow-popover animate-fade-in';

/**
 * Filtro em menu: o botão mostra "Rótulo: escolha" e abre a lista logo
 * embaixo, com o check na opção atual, como o seletor de empresa da referência.
 */
export const FilterDropdown = <T extends string>({ label, value, options, onChange, icon, className }: FilterDropdownProps<T>) => {
  const { open, toggle, close, containerRef } = usePopover();
  const current = options.find((option) => option.value === value) ?? options[0];
  const { panelRef, alignClassName } = useFlipToFit(open);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={toggle} className={cn(FILTER_BUTTON, open && 'border-accent')}>
        {icon && (
          <span aria-hidden="true" className="shrink-0 text-ink-2">
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">
          <span className="text-ink-2">{label}: </span>
          <span className="font-medium">{current?.label}</span>
        </span>
        <ChevronDownIcon size={16} className={cn('shrink-0 text-ink-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div ref={panelRef} role="menu" aria-label={label} className={cn(FILTER_PANEL, alignClassName, 'w-max min-w-full max-w-[min(24rem,calc(100vw-2rem))]')}>
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
                className={cn(
                  'flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-body',
                  selected ? 'bg-brand-50 font-semibold text-brand-strong' : 'text-ink hover:bg-canvas',
                )}
              >
                <span className="min-w-0 flex-1">{option.label}</span>
                {option.count !== undefined && <span className="text-small text-ink-3 tabular-nums">{option.count}</span>}
                <span aria-hidden="true" className="w-4 shrink-0">
                  {selected && <CheckIcon size={16} />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
