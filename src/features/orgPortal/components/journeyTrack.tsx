import { CheckIcon } from '@/components/ui/icons';
import type { OrgDemandStage } from '@/domain/submission';
import { cn } from '@/utils/cn';
import { JOURNEY, journeyIndex } from '../utils/orgPresentation';

/**
 * Os cinco passos de um pedido, do envio ao fim do projeto. Os feitos ganham o
 * check verde da linha das etapas; o atual fica em destaque, os próximos apagados.
 */
export const JourneyTrack = ({ stage, hideMobileLabel }: { stage: OrgDemandStage; /** O cabeçalho já escreve o passo atual. */ hideMobileLabel?: boolean }) => {
  const current = journeyIndex(stage);
  const finished = stage === 'done';

  return (
    <div>
    <ol aria-label="Caminho da demanda" className="grid grid-cols-5 gap-1.5">
      {JOURNEY.map((step, index) => {
        const done = index < current || finished;
        const isCurrent = index === current && !finished;
        return (
          <li key={step.label} aria-current={isCurrent ? 'step' : undefined} className="min-w-0">
            <span className={cn('block h-1 rounded-full', done ? 'bg-positive' : isCurrent ? 'bg-brand' : 'bg-fill-strong')} />
            <span
              className={cn(
                'mt-2 flex items-start gap-1 text-[12px] leading-snug',
                done ? 'text-ink-2' : isCurrent ? 'font-semibold text-ink' : 'text-ink-3',
                'max-sm:sr-only',
              )}
            >
              {done && <CheckIcon size={12} className="mt-0.5 shrink-0 text-positive" />}
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
      {/* No celular os cinco rótulos não cabem lado a lado: fica só o passo atual. */}
      <p aria-hidden="true" className={cn('mt-2 text-[13px] text-ink sm:hidden', hideMobileLabel && 'hidden')}>
        {finished ? 'Concluída' : `Passo ${current + 1} de ${JOURNEY.length}: ${JOURNEY[current].label}`}
      </p>
    </div>
  );
};
