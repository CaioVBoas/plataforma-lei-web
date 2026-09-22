import { ClockIcon } from '@/components/ui/icons';
import type { SemesterContext } from '@/features/semester/types';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';

/** A partir de uma semana do prazo a faixa ganha peso, sem depender do docente abrir o e-mail. */
const URGENT_THRESHOLD_DAYS = 7;

export const ContextStrip = ({ context }: { context: SemesterContext }) => {
  const urgent = context.daysLeft <= URGENT_THRESHOLD_DAYS;
  return (
    <div className={cn('flex min-h-[34px] items-center gap-2 bg-n-0 px-8 pt-2 text-[13px]', urgent ? 'font-medium text-n-800' : 'text-n-500')}>
      <ClockIcon size={13} />
      <span>
        Semestre {context.current} · {context.nextDeadline} · {pluralize(context.daysLeft, 'dia restante', 'dias restantes')}
      </span>
    </div>
  );
};
