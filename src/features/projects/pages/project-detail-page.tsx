import { useParams, useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { useToast } from '@/components/feedback/toast-context';
import { BackLink } from '@/components/ui/back-link';
import { Button } from '@/components/ui/button';
import { UnderlineTabs } from '@/components/ui/underline-tabs';
import { usePageHeader } from '@/layouts/portal/page-header-context';
import { paths } from '@/routes/paths';
import { downloadFile } from '@/utils/download-file';
import { DraftTab } from '../components/detail/draft-tab';
import { HoursTab } from '../components/detail/hours-tab';
import { LogTab } from '../components/detail/log-tab';
import { OverviewTab } from '../components/detail/overview-tab';
import { TeamsTab } from '../components/detail/teams-tab';
import { useProject } from '../hooks/use-projects';
import type { Project } from '../types';
import { hoursCsv, participantsCsv } from '../utils/project-exports';

const TABS = [
  { value: 'visao', label: 'Visão geral' },
  { value: 'equipes', label: 'Equipes' },
  { value: 'andamento', label: 'Andamento' },
  { value: 'horas', label: 'Horas' },
  { value: 'rascunho', label: 'Rascunho' },
] as const;

type Tab = (typeof TABS)[number]['value'];

const isTab = (value: string | null): value is Tab => TABS.some((tab) => tab.value === value);

const ProjectDetailView = ({ project }: { project: Project }) => {
  const toast = useToast();
  // A aba vive na URL para que "Ver todas as equipes" abra direto nela.
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('aba');
  const tab: Tab = isTab(requestedTab) ? requestedTab : 'visao';
  const openTab = (next: Tab) => setSearchParams(next === 'visao' ? {} : { aba: next }, { replace: true });

  const exportParticipants = () => {
    downloadFile(`participantes-${project.id}.csv`, participantsCsv(project), 'text/csv');
    toast.show('Lista de participantes baixada em CSV. O envio ao SIGAA é feito por você.');
  };

  const exportHours = () => {
    downloadFile(`horas-${project.id}.csv`, hoursCsv(project), 'text/csv');
    toast.show('Planilha de horas baixada em CSV. O envio ao SIGAA é feito por você.');
  };

  return (
    <div>
      <BackLink to={project.completion ? paths.completedProjects : paths.runningProjects}>Voltar a Meus projetos</BackLink>

      <div className="mb-12 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-[1_1_480px]">
          <h2 className="mb-2.5 max-w-[900px] text-[30px] leading-tight font-bold tracking-[-.02em] text-pretty text-n-800">{project.title}</h2>
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="font-medium text-n-800">{project.disciplineName}</span>
            <span className="text-n-500">{project.partnerName}</span>
          </div>
        </div>
        {!project.completion && (
          <Button variant="primary" size="lg" onClick={() => openTab('andamento')}>
            Registrar andamento
          </Button>
        )}
      </div>

      <UnderlineTabs label="Seções do projeto" items={[...TABS]} value={tab} onChange={openTab} className="mb-12" />

      {tab === 'visao' && <OverviewTab project={project} />}
      {tab === 'equipes' && <TeamsTab teams={project.detail.teams} onExportParticipants={exportParticipants} />}
      {tab === 'andamento' && <LogTab projectId={project.id} entries={project.detail.log} />}
      {tab === 'horas' && <HoursTab detail={project.detail} onExport={exportHours} />}
      {tab === 'rascunho' && <DraftTab proposalId={project.proposalId} />}
    </div>
  );
};

export const ProjectDetailPage = () => {
  const { projectId = '' } = useParams();
  const projectQuery = useProject(projectId);
  const project = projectQuery.data;
  usePageHeader(
    project?.completion ? 'Projeto concluído' : 'Projeto em execução',
    project ? `${project.disciplineName} · ${project.partnerName}` : '',
  );

  return <QueryView query={projectQuery}>{(loaded) => <ProjectDetailView project={loaded} />}</QueryView>;
};
