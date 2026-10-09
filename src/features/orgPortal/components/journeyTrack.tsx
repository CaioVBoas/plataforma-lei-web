import { CheckIcon } from '@/components/ui/icons';
import type { OrgDemandStage } from '@/domain/submission';
import { cn } from '@/utils/cn';
import { JOURNEY, journeyIndex } from '../utils/orgPresentation';

/**
 * Os cinco passos de um pedido, numerados e ligados por um traço, como o
 * caminho do Como funciona: feitos com check verde, o atual em petróleo com
 * "Agora" embaixo, os próximos apagados. No celular fica só o passo atual escrito.
 */
export const JourneyTrack = ({ stage }: { stage: OrgDemandStage }) => {
  const current = journeyIndex(stage);
  const finished = stage === 'done';

  return (
    <section aria-label="Onde a demanda está" className="rounded-lg border border-line bg-surface px-4 py-5 sm:px-6">
      <p className="mb-4 text-small font-semibold text-brand-strong">Onde a demanda está</p>
      <ol className="relative flex justify-between gap-1">
        <span aria-hidden="true" className="absolute top-4 right-[10%] left-[10%] h-px bg-line-strong" />
        {JOURNEY.map((step, index) => {
          const done = index < current || finished;
          const isCurrent = index === current && !finished;
          return (
            <li key={step.label} aria-current={isCurrent ? 'step' : undefined} className="relative flex min-w-0 flex-1 flex-col items-center text-center">
              <span
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-small font-semibold ring-4 ring-surface tabular-nums',
                  done ? 'bg-positive-soft text-positive' : isCurrent ? 'bg-brand text-white' : 'bg-fill text-ink-3',
                )}
              >
                {done ? <CheckIcon size={14} strokeWidth={2.2} /> : index + 1}
                <span className="sr-only">{done ? ' feito' : isCurrent ? ' agora' : ' depois'}</span>
              </span>
              <span className={cn('mt-2 hidden text-small sm:block', isCurrent ? 'font-semibold text-ink' : done ? 'text-ink-2' : 'text-ink-3')}>
                {step.label}
              </span>
              {isCurrent && <span className="mt-0.5 hidden text-caption font-semibold text-brand sm:block">Agora</span>}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-small text-ink sm:hidden">
        {finished ? 'Todos os passos feitos.' : `Passo ${current + 1} de ${JOURNEY.length}: ${JOURNEY[current].label}`}
      </p>
    </section>
  );
};
