import { useParams, useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { BackLink } from '@/components/ui/back-link';
import { UnderlineTabs } from '@/components/ui/underline-tabs';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { CompatibleDemandsTab } from '../components/detail/compatible-demands-tab';
import { OverviewTab } from '../components/detail/overview-tab';
import { PracticeTab } from '../components/detail/practice-tab';
import { ProjectsTab } from '../components/detail/projects-tab';
import { useDiscipline } from '../hooks/use-disciplines';
import type { Discipline } from '../types';
import { disciplineDataLine } from '../utils/discipline-presentation';

const TABS = [
  { value: 'visao', label: 'Visão geral' },
  { value: 'pratica', label: 'Prática' },
  { value: 'projetos', label: 'Projetos' },
  { value: 'demandas', label: 'Demandas compatíveis' },
] as const;

type Tab = (typeof TABS)[number]['value'];

const isTab = (value: string | null): value is Tab => TABS.some((tab) => tab.value === value);

const DisciplineDetail = ({ discipline }: { discipline: Discipline }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('aba');
  const tab: Tab = isTab(requestedTab) ? requestedTab : 'visao';
  const openTab = (next: Tab) => setSearchParams(next === 'visao' ? {} : { aba: next }, { replace: true });

  return (
    <div>
      <BackLink to={paths.disciplines}>Voltar para minhas disciplinas</BackLink>

      <div className="mb-12">
        <div className="flex flex-wrap items-baseline gap-2.5">
          <h2 className="text-[30px] leading-tight font-bold tracking-[-.02em] text-n-800">{discipline.name}</h2>
          <span className="text-base text-n-500">{discipline.code}</span>
        </div>
        <p className="mt-2.5 max-w-[76ch] text-[13px] leading-[1.55] text-n-500">{disciplineDataLine(discipline)}</p>
        {discipline.paused && <p className="mt-1.5 text-[13px] font-medium text-n-600">Não recebe demandas neste semestre</p>}
      </div>

      <UnderlineTabs label="Seções da disciplina" items={[...TABS]} value={tab} onChange={openTab} className="mb-12" />

      {/* A chave recria a ementa em edição quando o docente troca de disciplina. */}
      {tab === 'visao' && <OverviewTab key={discipline.id} discipline={discipline} />}
      {tab === 'pratica' && <PracticeTab discipline={discipline} />}
      {tab === 'projetos' && <ProjectsTab discipline={discipline} onShowCompatibleDemands={() => openTab('demandas')} />}
      {tab === 'demandas' && <CompatibleDemandsTab discipline={discipline} />}
    </div>
  );
};

export const DisciplineDetailPage = () => {
  usePageHeader('Detalhe da disciplina', 'Ementa, prática e demandas desta turma');
  const { disciplineId = '' } = useParams();
  const disciplineQuery = useDiscipline(disciplineId);
  return <QueryView query={disciplineQuery}>{(discipline) => <DisciplineDetail discipline={discipline} />}</QueryView>;
};
