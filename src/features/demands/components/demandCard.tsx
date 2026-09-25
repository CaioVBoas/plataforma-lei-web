import { Link } from 'react-router-dom';
import { BookIcon } from '@/components/ui/icons';
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
 * Um prato do cardápio: quem pede, o problema, o que pede da turma e as duas
 * perguntas que decidem (combina? cabe?) e o que pesa na rotina, em tags no rodapé.
 * A reserva aparece no topo, em laranja.
 */
export const DemandCard = ({ demand, best, today }: DemandCardProps) => {
  const scope = SCOPE_COPY[demand.scopeFit];
  const reservation = reservationBadge(demand, today);
  const covered = new Set(best?.covered ?? []);
  const takenByOther = demand.status === 'reserved' && !demand.reservation?.mine;
  const match = matchTag(best);

  return (
    <Link
      to={paths.demand(demand.id)}
      className={cn(
        'group flex h-full flex-col rounded-lg border bg-surface p-5 transition-[border-color,box-shadow] duration-150 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
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
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-2">{demand.problem}</p>

      <p className="mt-5 text-[12px] font-medium text-ink-3">
        Competências
        {best?.fits && (
          <span className="font-normal">
            {' '}
            · a turma cobre {best.covered.length} de {demand.skills.length}
          </span>
        )}
      </p>
      <div className="mt-2 mb-5 flex flex-1 flex-wrap content-start gap-1.5">
        {demand.skills.map((skill) => (
          <Tag key={skill} covered={covered.has(skill)}>
            {skill}
          </Tag>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-t border-line pt-4">
        <Tag tone={match.tone} icon={best?.fits ? <BookIcon size={13} /> : undefined}>
          {match.label}
        </Tag>
        <Tag tone={scope.tone === 'caution' ? 'caution' : 'neutral'}>{scope.label}</Tag>
        {demand.constraints.map((constraint) => (
          <Tag key={constraint}>{CONSTRAINT_COPY[constraint].label}</Tag>
        ))}
      </div>
    </Link>
  );
};
