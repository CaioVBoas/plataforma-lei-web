import { Button } from '@/components/ui/button';
import { ArrowRightIcon, CheckIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import { SEARCH_STEPS, type SearchFacts } from '../utils/stageCopy';

interface SearchProgressProps {
  step: number;
  facts: SearchFacts;
  disciplineName: string;
  onSkip: () => void;
}

/** Os três passos são a regra de compatibilidade de verdade, na ordem em que ela roda. */
const rows = (disciplineName: string, facts: SearchFacts) => [
  { label: `Competências de ${disciplineName}`, value: String(facts.skills) },
  { label: 'Demandas do cardápio', value: String(facts.menu) },
  { label: 'Combinam com a turma', value: String(facts.fits) },
];

/**
 * A espera do Match Maker. O palco em cima faz a parte expressiva; aqui ficam os
 * números reais de cada passo e a saída "Ver agora", para ninguém esperar à toa.
 */
export const SearchProgress = ({ step, facts, disciplineName, onSkip }: SearchProgressProps) => (
  <div className="mx-auto mt-10 max-w-xl" role="group" aria-label="Andamento da busca">
    <ol className="space-y-3">
      {rows(disciplineName, facts).map((row, index) => {
        const done = step > index;
        const active = step === index;
        return (
          <li key={row.label} className={cn('flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors duration-300', done ? 'border-line bg-surface' : active ? 'border-brand/40 bg-brand-soft' : 'border-line bg-surface opacity-60')}>
            <span aria-hidden="true" className="flex size-6 shrink-0 items-center justify-center">
              {done ? (
                <span className="flex size-6 animate-step-pop items-center justify-center rounded-full bg-positive text-white">
                  <CheckIcon size={14} strokeWidth={2.8} />
                </span>
              ) : active ? (
                <span className="size-5 rounded-full border-2 border-brand-200 border-t-brand motion-safe:animate-spin" />
              ) : (
                <span className="size-5 rounded-full border border-line-strong" />
              )}
            </span>
            <span className={cn('min-w-0 flex-1 text-small', done || active ? 'text-ink' : 'text-ink-3')}>{row.label}</span>
            {done && <span className="animate-rise-in text-small font-semibold text-ink tabular-nums">{row.value}</span>}
            <span className="sr-only">{done ? ', concluído' : active ? ', em andamento' : ', aguardando'}</span>
          </li>
        );
      })}
    </ol>
    <div className="mt-4 flex gap-1.5" aria-hidden="true">
      {Array.from({ length: SEARCH_STEPS }, (_, index) => (
        <span key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-fill">
          <span className={cn('block h-full rounded-full bg-brand transition-[width] ease-linear', step > index ? 'w-full duration-500' : step === index ? 'w-1/2 duration-700' : 'w-0')} />
        </span>
      ))}
    </div>
    <div className="mt-6 flex justify-end">
      <Button variant="plain" onClick={onSkip}>
        Ver agora
        <ArrowRightIcon size={16} />
      </Button>
    </div>
  </div>
);
