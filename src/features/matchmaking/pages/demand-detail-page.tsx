import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { Avatar } from '@/components/ui/avatar';
import { BackLink } from '@/components/ui/back-link';
import { Button } from '@/components/ui/button';
import { CalendarIcon, HexagonIcon } from '@/components/ui/icons';
import { SignalPill } from '@/components/ui/signal-pill';
import { useCurrentDisciplines } from '@/features/disciplines/hooks/use-disciplines';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { CompetenciesSection } from '../components/detail/competencies-section';
import { ConversationSection } from '../components/detail/conversation-section';
import { DisciplineFitSection } from '../components/detail/discipline-fit-section';
import { OrganizationSection } from '../components/detail/organization-section';
import { ProblemSection } from '../components/detail/problem-section';
import { ReferencesSection } from '../components/detail/references-section';
import { CompetencyReadingPanel } from '../components/competency-reading-panel';
import { MatchExplanationPanel } from '../components/match-explanation-panel';
import { ViabilityPill } from '../components/viability-pill';
import { useDemandActions } from '../hooks/use-demand-actions';
import { useDemandDetail } from '../hooks/use-demands';
import type { DemandDetail } from '../types';
import { DEMAND_ACTION, organizationLine, rankDisciplines } from '../utils/demand-presentation';

/** Parâmetro que abre a explicação já na disciplina indicada (vindo da tela da disciplina). */
const EXPLAIN_PARAM = 'explicar';

const DemandDetailView = ({ demand }: { demand: DemandDetail }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [readingOpen, setReadingOpen] = useState(false);
  const { data: disciplines = [] } = useCurrentDisciplines();
  const { runPrimaryAction, isBusy } = useDemandActions();

  const matches = rankDisciplines(demand, disciplines);
  const best = matches[0];
  const explainedDisciplineId = searchParams.get(EXPLAIN_PARAM);
  const canTalk = demand.status === 'reserved-by-me' || demand.status === 'accepted';

  const explain = (disciplineId: string | null) =>
    setSearchParams(disciplineId ? { [EXPLAIN_PARAM]: disciplineId } : {}, { replace: true });

  return (
    <div>
      <BackLink to={paths.menu}>Voltar ao cardápio</BackLink>

      <div className="mx-auto max-w-[760px]">
        <div className="mt-6 mb-4 flex items-center gap-3">
          <Avatar name={demand.organizationName} size="lg" />
          <span className="text-[15px] font-medium text-n-800">{demand.organizationName}</span>
          <span className="text-[13px] text-n-500">{demand.organizationType}</span>
        </div>
        <h2 className="mb-5 text-[30px] leading-[1.3] font-bold tracking-[-.02em] text-pretty text-n-800">{demand.problem}</h2>
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <ViabilityPill viability={demand.viability} note={demand.viabilityNote} />
          <SignalPill icon={<CalendarIcon size={15} />}>{demand.followUpCadence}</SignalPill>
          {best && (
            <SignalPill icon={<HexagonIcon size={15} />}>
              {best.percent}% com {best.discipline.name}
            </SignalPill>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <ProblemSection demand={demand} />
          <DisciplineFitSection matches={matches} onExplain={explain} />
          <CompetenciesSection demandId={demand.id} competencies={demand.competencies} onOpenReading={() => setReadingOpen(true)} />
          <ReferencesSection references={demand.references} />
          <OrganizationSection demand={demand} canTalk={canTalk} />
          {canTalk && <ConversationSection demandId={demand.id} messages={demand.conversation} />}
        </div>
        <div className="h-24" aria-hidden="true" />
      </div>

      <div className="fixed right-0 bottom-0 left-[248px] z-30 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-n-200 bg-n-0 px-8 py-3.5">
        <div className="flex min-w-0 flex-col gap-[3px] text-[13px] text-n-500">
          <p>A reserva vale por 5 dias úteis.</p>
          <p>Você decide depois de conversar com a organização, se precisar.</p>
        </div>
        <Button variant="primary" size="lg" disabled={isBusy} onClick={() => runPrimaryAction(demand)}>
          {DEMAND_ACTION[demand.status].label}
        </Button>
      </div>

      {explainedDisciplineId && matches.length > 0 && (
        <MatchExplanationPanel
          demandId={demand.id}
          matches={matches}
          disciplineId={explainedDisciplineId}
          onChangeDiscipline={explain}
          onClose={() => explain(null)}
        />
      )}
      {readingOpen && <CompetencyReadingPanel demandId={demand.id} onClose={() => setReadingOpen(false)} />}
    </div>
  );
};

export const DemandDetailPage = () => {
  const { demandId = '' } = useParams();
  const demandQuery = useDemandDetail(demandId);
  usePageHeader('Detalhe da demanda', demandQuery.data ? organizationLine(demandQuery.data) : '');

  return (
    <QueryView query={demandQuery} loadingLabel="Carregando a demanda">
      {(demand) => <DemandDetailView demand={demand} />}
    </QueryView>
  );
};
