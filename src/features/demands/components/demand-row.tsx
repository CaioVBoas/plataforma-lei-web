import { ListRow } from '@/components/ui/grouped-list';
import { StatusLabel } from '@/components/ui/status-label';
import type { DisciplineMatch } from '@/domain/matching';
import type { Demand, IsoDate } from '@/domain/types';
import { paths } from '@/routes/paths';
import { isNew, matchLine, SCOPE_COPY } from '../utils/demand-presentation';

interface DemandRowProps {
  demand: Demand;
  best: DisciplineMatch | undefined;
  today: IsoDate;
}

/** Quem pede, o problema, e as duas perguntas que decidem: combina com minha turma? cabe no semestre? */
export const DemandRow = ({ demand, best, today }: DemandRowProps) => {
  const scope = SCOPE_COPY[demand.scopeFit];
  return (
    <ListRow to={paths.demand(demand.id)} className="py-4">
      <p className="flex items-center gap-2 text-[13px] text-ink-3">
        {demand.organization.name}
        {isNew(demand, today) && <span className="font-medium text-accent">Nova</span>}
      </p>
      <p className="mt-0.5 text-[17px] font-semibold tracking-[-0.01em] text-ink">{demand.title}</p>
      <p className="mt-1 line-clamp-2 max-w-[70ch] text-sm leading-relaxed text-ink-2">{demand.problem}</p>
      <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
        <StatusLabel tone={best?.fits ? 'positive' : 'neutral'}>{matchLine(best, demand)}</StatusLabel>
        <StatusLabel tone={scope.tone}>{scope.label}</StatusLabel>
      </div>
    </ListRow>
  );
};
