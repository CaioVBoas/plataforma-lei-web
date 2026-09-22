import { Button } from '@/components/ui/button';
import { ClockIcon, InfoIcon } from '@/components/ui/icons';
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

interface PastSemesterBannerProps {
  semester: string;
  current: string;
  onBack: () => void;
}

export const PastSemesterBanner = ({ semester, current, onBack }: PastSemesterBannerProps) => (
  <div role="status" className="flex min-h-10 flex-wrap items-center gap-x-3.5 gap-y-2 border-b border-n-200 px-8 py-2">
    <InfoIcon size={14} className="text-n-600" />
    <span className="min-w-0 flex-1 text-[13px] text-n-700">Você está vendo {semester}, um semestre encerrado</span>
    <Button variant="secondary" size="sm" className="h-8" onClick={onBack}>
      Voltar para {current}
    </Button>
  </div>
);
