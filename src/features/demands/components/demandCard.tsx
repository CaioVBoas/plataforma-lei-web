import { Link } from 'react-router-dom';
import { CoverageMeter } from '@/components/ui/coverageMeter';
import { Tag } from '@/components/ui/tag';
import type { DisciplineMatch } from '@/domain/matching';
import type { Demand, IsoDate } from '@/domain/types';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { CONSTRAINT_COPY, isNew, matchTag, reservationBadge, SCOPE_COPY } from '../utils/demandPresentation';

interface DemandCardProps {
  demand: Demand;
  best: DisciplineMatch | undefined;
  today: IsoDate;
}

/**
 * Um prato do cardápio: quem pede, o problema e as duas perguntas que decidem.
 * "Combina?" vira um medidor com a turma que mais cobre; "cabe?" e o que pesa
 * na rotina viram uma linha de texto. Só o estado da demanda é tag. As
 * competências uma a uma ficam no detalhe, onde há espaço para explicá-las.
 */
export const DemandCard = ({ demand, best, today }: DemandCardProps) => {
  const scope = SCOPE_COPY[demand.scopeFit];
  const reservation = reservationBadge(demand, today);
  const takenByOther = demand.status === 'reserved' && !demand.reservation?.mine;
  const match = matchTag(best);
  const facts = [scope.label, ...demand.constraints.map((constraint) => CONSTRAINT_COPY[constraint].label)];

  return (
    <Link
      to={paths.demand(demand.id)}
      className={cn(
        'group flex h-full min-w-0 flex-col rounded-lg border bg-surface p-5 transition-[border-color,box-shadow] duration-150 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
        demand.reservation?.mine ? 'border-reserve-dot/40' : 'border-line hover:border-line-strong',
      )}
    >
      <div className="flex min-h-6 flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
        <p className="text-[13px] text-ink-3">{demand.organization.name}</p>
        {reservation ? (
          <Tag tone={takenByOther ? 'neutral' : 'reserve'}>{reservation}</Tag>
        ) : demand.invitation ? (
          <Tag tone="accent">Indicada para você</Tag>
        ) : (
          isNew(demand, today) && <Tag tone="accent">Nova</Tag>
        )}
      </div>

      <p className="mt-2 text-[17px] leading-snug font-semibold tracking-[-0.01em] text-ink group-hover:text-accent">{demand.title}</p>
      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-2">{demand.problem}</p>

      <div className="mt-5 border-t border-line pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className={cn('min-w-0 truncate text-sm', match.tone === 'accent' ? 'font-medium text-ink' : 'text-ink-3')}>{match.label}</p>
          {best && <CoverageMeter covered={best.covered.length} total={demand.skills.length} fits={best.fits} />}
        </div>
        <p className="mt-1 truncate text-[13px] text-ink-3">
          {best && `${best.covered.length} de ${demand.skills.length} competências · `}
          <span className={scope.tone === 'caution' ? 'text-caution' : undefined}>{facts[0]}</span>
          {facts.length > 1 && ` · ${facts.slice(1).join(' · ')}`}
        </p>
      </div>
    </Link>
  );
};
