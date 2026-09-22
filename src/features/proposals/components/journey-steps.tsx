import { CheckIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';

const STEPS = ['Disciplina', 'Proposta', 'Registro no SIGAA'];

interface JourneyStepsProps {
  /** Etapa em andamento (1 a 3); acima de 3 significa jornada concluída. */
  current: number;
}

/**
 * Indicador da jornada "da demanda ao SIGAA", o mesmo no vínculo e no editor,
 * para o docente saber onde está e quanto falta.
 */
export const JourneySteps = ({ current }: JourneyStepsProps) => (
  <ol aria-label="Da demanda ao SIGAA" className="flex flex-wrap items-center gap-x-3 gap-y-2">
    {STEPS.map((label, index) => {
      const step = index + 1;
      const done = step < current;
      const active = step === current;
      return (
        <li key={label} aria-current={active ? 'step' : undefined} className="flex items-center gap-3">
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn(
                'flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums',
                done && 'bg-azul-500 text-n-0',
                active && 'border-2 border-azul-500 text-azul-800',
                !done && !active && 'border border-n-300 text-n-500',
              )}
            >
              {done ? <CheckIcon size={11} /> : step}
            </span>
            <span className={cn('text-[13px]', active ? 'font-semibold text-n-800' : 'text-n-500')}>
              {label}
              {done && <span className="sr-only"> (concluída)</span>}
            </span>
          </span>
          {step < STEPS.length && <span aria-hidden="true" className={cn('h-px w-8', done ? 'bg-azul-500' : 'bg-n-300')} />}
        </li>
      );
    })}
  </ol>
);
