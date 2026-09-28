import { useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

export interface SpotlightItem {
  icon: ReactNode;
  title: string;
  /** Texto do cartão em destaque: uma frase ou uma lista curta. */
  body: ReactNode;
}

/** Vizinho esmaecido do carrossel: clicar traz o cartão para o meio. */
const SideCard = ({ item, onSelect }: { item: SpotlightItem; onSelect: () => void }) => (
  <button
    type="button"
    onClick={onSelect}
    aria-label={`Ver ${item.title}`}
    className="hidden h-[220px] w-[240px] shrink-0 flex-col items-center justify-center gap-4 rounded-lg bg-fill px-6 text-center text-ink-3 transition-colors hover:bg-fill-strong md:flex"
  >
    <span className="flex size-12 items-center justify-center rounded-full bg-surface">{item.icon}</span>
    <span className="text-[15px] font-semibold text-ink-2">{item.title}</span>
  </button>
);

const ARROW = 'flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-ink hover:bg-fill';

/**
 * Carrossel em destaque: o cartão do meio em petróleo, os vizinhos esmaecidos,
 * setas e pontos. Usado no portal ("O que você encontra") e nas regras do Como funciona.
 */
export const SpotlightCarousel = ({ items, label, wide }: { items: SpotlightItem[]; label: string; wide?: boolean }) => {
  const [active, setActive] = useState(0);
  const count = items.length;
  const at = (offset: number) => items[(active + offset + count) % count];
  const move = (step: number) => setActive((current) => (current + step + count) % count);
  const current = at(0);

  return (
    <div role="region" aria-roledescription="carrossel" aria-label={label}>
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        <button type="button" aria-label="Anterior" onClick={() => move(-1)} className={ARROW}>
          <ChevronLeftIcon size={18} />
        </button>

        {count > 2 && <SideCard item={at(-1)} onSelect={() => move(-1)} />}
        <div
          aria-live="polite"
          className={cn(
            'flex min-h-[260px] w-full flex-col items-center justify-center rounded-lg bg-brand px-7 py-8 text-center text-white shadow-sheet',
            wide ? 'max-w-[400px]' : 'max-w-[320px]',
          )}
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-brand-700">{current.icon}</span>
          <p className="mt-5 text-[18px] font-semibold">{current.title}</p>
          <div className="mt-2 text-sm leading-relaxed text-white/80">{current.body}</div>
        </div>
        {count > 1 && <SideCard item={at(1)} onSelect={() => move(1)} />}

        <button type="button" aria-label="Próximo" onClick={() => move(1)} className={ARROW}>
          <ChevronRightIcon size={18} />
        </button>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-label={item.title}
            aria-current={index === active}
            onClick={() => setActive(index)}
            className={cn('h-2 rounded-full transition-all', index === active ? 'w-6 bg-brand' : 'w-2 bg-line-strong hover:bg-ink-3')}
          />
        ))}
      </div>
    </div>
  );
};
