import { Link } from 'react-router-dom';
import { StatusLabel } from '@/components/ui/statusLabel';
import { Tag } from '@/components/ui/tag';
import type { DisciplineMatch } from '@/domain/matching';
import type { Demand, IsoDate } from '@/domain/types';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { isNew, matchLine, reservationBadge, SCOPE_COPY } from '../utils/demandPresentation';

interface DemandCardProps {
  demand: Demand;
  best: DisciplineMatch | undefined;
  today: IsoDate;
}

/**
 * Um prato do cardápio: quem pede, o problema, o que pede da turma e as duas
 * perguntas que decidem (combina? cabe?). A reserva aparece no topo, em laranja.
 */
export const DemandCard = ({ demand, best, today }: DemandCardProps) => {
  const scope = SCOPE_COPY[demand.scopeFit];
  const reservation = reservationBadge(demand, today);
  const covered = new Set(best?.covered ?? []);
  const takenByOther = demand.status === 'reserved' && !demand.reservation?.mine;

  return (
    <Link
      to={paths.demand(demand.id)}
      className={cn(
        'group flex h-full flex-col rounded-lg border bg-surface p-5 transition-[border-color,box-shadow] duration-150 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
        demand.reservation?.mine ? 'border-reserve-dot/40' : 'border-line hover:border-line-strong',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <p className="flex items-center gap-2 text-[13px] text-ink-3">
          {demand.organization.name}
          {isNew(demand, today) && !reservation && <span className="font-medium text-accent">Nova</span>}
        </p>
        {reservation && <StatusLabel tone={takenByOther ? 'neutral' : 'reserve'}>{reservation}</StatusLabel>}
      </div>

      <p className="mt-1.5 text-[17px] leading-snug font-semibold tracking-[-0.01em] text-ink group-hover:text-accent">{demand.title}</p>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-2">{demand.problem}</p>

      <div className="mt-4 mb-4 flex flex-1 flex-wrap content-start gap-1.5">
        {demand.skills.map((skill) => (
          <Tag key={skill} covered={covered.has(skill)}>
            {skill}
          </Tag>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 border-t border-line pt-3.5">
        <StatusLabel tone={best?.fits ? 'positive' : 'neutral'}>{matchLine(best, demand)}</StatusLabel>
        <StatusLabel tone={scope.tone}>{scope.label}</StatusLabel>
      </div>
    </Link>
  );
};
