import { useState } from 'react';
import { useFlipToFit } from '@/hooks/useFlipToFit';
import { usePopover } from '@/hooks/usePopover';
import { cn } from '@/utils/cn';
import { MONTH_NAMES, monthLabel } from '@/utils/format';
import { FILTER_BUTTON, FILTER_PANEL } from './filterDropdown';
import { CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

interface MonthPickerProps {
  /** "AAAA-MM", ou vazio para todos os meses. */
  value: string;
  onChange: (month: string) => void;
  /** Meses que têm alguma coisa: os outros ficam apagados e não se escolhem. */
  available: string[];
  /** Mês de hoje, marcado com um ponto. */
  current: string;
  label?: string;
}

/**
 * Filtro de mês no desenho do calendário da referência: o botão com o
 * ícone de calendário abre o ano em grade de três colunas, com setas para
 * trocar de ano. O mês escolhido fica destacado; meses sem nada, apagados.
 */
export const MonthPicker = ({ value, onChange, available, current, label = 'Mês' }: MonthPickerProps) => {
  const { open, toggle, close, containerRef } = usePopover();
  const years = [...new Set(available.map((month) => month.slice(0, 4)))].sort();
  const [year, setYear] = useState(() => (value || current).slice(0, 4));
  const yearIndex = years.indexOf(year);
  const { panelRef, alignClassName } = useFlipToFit(open);

  const pick = (month: string) => {
    onChange(month);
    close();
  };

  return (
    <div ref={containerRef} className="relative">
      <button type="button" aria-haspopup="dialog" aria-expanded={open} onClick={toggle} className={cn(FILTER_BUTTON, open && 'border-accent')}>
        <CalendarIcon size={20} className="shrink-0 text-ink-2" />
        <span className="min-w-0 flex-1 truncate">
          <span className="text-ink-2">{label}: </span>
          <span className="font-medium">{value ? monthLabel(value) : 'Todos'}</span>
        </span>
        <ChevronDownIcon size={16} className={cn('shrink-0 text-ink-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div ref={panelRef} role="dialog" aria-label={`Escolher ${label.toLowerCase()}`} className={cn(FILTER_PANEL, alignClassName, 'w-[min(22rem,calc(100vw-2rem))] p-4')}>
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              aria-label="Ano anterior"
              disabled={yearIndex <= 0}
              onClick={() => setYear(years[yearIndex - 1])}
              className="flex size-10 items-center justify-center rounded-md text-ink-2 hover:bg-fill disabled:opacity-30"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <p className="text-h4 font-semibold text-ink tabular-nums">{year}</p>
            <button
              type="button"
              aria-label="Próximo ano"
              disabled={yearIndex < 0 || yearIndex >= years.length - 1}
              onClick={() => setYear(years[yearIndex + 1])}
              className="flex size-10 items-center justify-center rounded-md text-ink-2 hover:bg-fill disabled:opacity-30"
            >
              <ChevronRightIcon size={20} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((name, index) => {
              const month = `${year}-${String(index + 1).padStart(2, '0')}`;
              const enabled = available.includes(month);
              const selected = month === value;
              return (
                <button
                  key={month}
                  type="button"
                  disabled={!enabled}
                  aria-pressed={selected}
                  aria-label={`${MONTH_NAMES[index]} de ${year}${month === current ? ', mês atual' : ''}`}
                  onClick={() => pick(month)}
                  className={cn(
                    'relative flex h-12 items-center justify-center rounded-lg text-body font-semibold uppercase transition-colors',
                    selected ? 'border border-brand bg-brand-50 text-brand-strong' : enabled ? 'border border-line text-ink hover:bg-canvas' : 'text-ink-3/60',
                  )}
                >
                  {name}
                  {month === current && <span aria-hidden="true" className="absolute top-1.5 right-2 size-1.5 rounded-full bg-brand" />}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => pick('')}
            className={cn('mt-3 flex h-11 w-full items-center justify-center rounded-lg text-body font-medium', value ? 'text-accent hover:bg-accent-soft' : 'bg-fill text-ink')}
          >
            Todos os meses
          </button>
        </div>
      )}
    </div>
  );
};
