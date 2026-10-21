import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface FilterBarProps {
  /** O que a linha filtra, dito ao leitor de tela: "Filtrar demandas". */
  label: string;
  children: ReactNode;
  /** Com filtro ligado, aparece "Limpar filtros" no fim da linha. */
  onClear?: () => void;
  className?: string;
}

/**
 * A linha de busca e filtros de toda lista do portal: o campo de busca primeiro,
 * depois um filtro em menu para cada recorte, que quebram de linha quando não cabem.
 * Quem pede para ser limpo (`onClear`) é porque há filtro ligado.
 */
export const FilterBar = ({ label, children, onClear, className }: FilterBarProps) => (
  <div role="search" aria-label={label} className={cn('mb-6 grid gap-3 sm:flex sm:flex-wrap sm:items-center', className)}>
    {children}
    {onClear && (
      <button type="button" onClick={onClear} className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-body font-medium text-accent hover:bg-accent-soft">
        Limpar filtros
      </button>
    )}
  </div>
);
