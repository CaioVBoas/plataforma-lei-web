import { Link } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { buttonClassName } from '@/components/ui/button-styles';
import { EmptyState } from '@/components/ui/empty-state';
import { AffinityMeter } from '@/components/ui/progress-indicators';
import { Tag } from '@/components/ui/tag';
import { ViabilityPill } from '@/features/matchmaking/components/viability-pill';
import { useDemandActions } from '@/features/matchmaking/hooks/use-demand-actions';
import { useDemands } from '@/features/matchmaking/hooks/use-demands';
import type { Demand } from '@/features/matchmaking/types';
import { DEMAND_ACTION } from '@/features/matchmaking/utils/demand-presentation';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import type { Discipline } from '../../types';

const DemandFit = ({ demand, discipline }: { demand: Demand; discipline: Discipline }) => {
  const { runPrimaryAction, isBusy } = useDemandActions();
  const percent = demand.matchByDiscipline[discipline.id] ?? 0;

  return (
    <li className="flex flex-col gap-3.5">
      <div className="flex items-center gap-3">
        <Avatar name={demand.organizationName} />
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-n-800">{demand.organizationName}</span>
        <span className="shrink-0 text-[13px] text-n-500">{demand.organizationType}</span>
      </div>
      <div>
        <Link to={paths.demand(demand.id)} className="block text-base leading-[1.4] font-semibold text-pretty text-n-800 hover:text-azul-800">
          {demand.problem}
        </Link>
        <p className="mt-[5px] text-[13px] text-n-600">Afeta: {demand.affectedPublic}</p>
      </div>
      <div className="flex max-w-[660px] flex-wrap items-start gap-3.5">
        <AffinityMeter percent={percent} label={discipline.name} className="mt-1.5" />
        <div className="shrink-0">
          <p className="text-[15px] leading-tight font-bold text-n-800 tabular-nums">{percent}%</p>
          <p className="text-[13px] text-n-600">com {discipline.name}</p>
        </div>
        <Link to={`${paths.demand(demand.id)}?explicar=${discipline.id}`} className={buttonClassName({ variant: 'outline-accent', size: 'sm' })}>
          Por que combina?
        </Link>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {demand.competencies.map((competency) => (
          <Tag key={competency.name} label={competency.name} inferred={!competency.confirmed} size="sm" />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-n-200 pt-3.5">
        <div className="flex flex-wrap items-center gap-4">
          <ViabilityPill viability={demand.viability} note={demand.viabilityNote} />
          <span className="text-[13px] text-n-500">Publicada há {pluralize(demand.publishedDaysAgo, 'dia', 'dias')}</span>
        </div>
        <Button variant="primary" disabled={isBusy} onClick={() => runPrimaryAction(demand)}>
          {DEMAND_ACTION[demand.status].label}
        </Button>
      </div>
    </li>
  );
};

export const CompatibleDemandsTab = ({ discipline }: { discipline: Discipline }) => {
  const demandsQuery = useDemands();

  return (
    <QueryView query={demandsQuery}>
      {(demands) => {
        const ranked = [...demands].sort((a, b) => (b.matchByDiscipline[discipline.id] ?? 0) - (a.matchByDiscipline[discipline.id] ?? 0));
        if (ranked.length === 0) {
          return (
            <EmptyState
              title="Nenhuma demanda compatível agora"
              description="Demandas novas entram no cardápio ao longo do semestre. Cadastrar a ementa desta turma aumenta o alcance das sugestões."
            />
          );
        }
        return (
          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-n-600">
                {pluralize(ranked.length, 'demanda compatível', 'demandas compatíveis')} com esta turma, ordenadas pelo percentual
              </p>
              <p className="text-xs text-n-500">Borda tracejada indica competência sugerida pela leitura automática e corrigível</p>
            </div>
            <ul className="flex flex-col gap-8">
              {ranked.map((demand) => (
                <DemandFit key={demand.id} demand={demand} discipline={discipline} />
              ))}
            </ul>
          </div>
        );
      }}
    </QueryView>
  );
};
