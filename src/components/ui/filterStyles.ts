import { cn } from '@/utils/cn';

/**
 * Botão e painel dos filtros da linha de filtragem: o mesmo desenho do seletor de mês.
 * Com um filtro ligado, o botão ganha o fundo suave da ação e o valor em negrito.
 */
export const FILTER_BUTTON =
  'flex h-11 w-full items-center gap-2 rounded-lg border bg-surface px-3.5 text-left text-label text-ink transition-colors sm:w-auto';
export const filterButtonClassName = (active: boolean, open: boolean) =>
  cn(FILTER_BUTTON, open ? 'border-accent' : active ? 'border-accent/45 bg-accent-soft' : 'border-line-strong hover:border-ink-3');
export const FILTER_PANEL = 'absolute top-full z-40 mt-2 rounded-xl border border-line bg-surface p-1.5 shadow-popover animate-fade-in';
