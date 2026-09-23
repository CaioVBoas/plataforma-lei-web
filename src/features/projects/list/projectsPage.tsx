import { Link } from 'react-router-dom';
import { ErrorState, LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { GroupedList } from '@/components/ui/groupedList';
import { Page, Section } from '@/components/ui/page';
import type { ProjectStage } from '@/domain/projectLifecycle';
import { paths } from '@/routes/paths';
import { ProjectRow } from '../shared/components/projectRow';
import { useProjectsList } from './useProjectsList';

/** Uma seção por estado, na ordem em que o projeto passa por eles. */
const GROUPS: { stage: ProjectStage; title: string; description: string }[] = [
  { stage: 'planning', title: 'Em planejamento', description: 'Plano, reunião de abertura e registro no SIGAA.' },
  { stage: 'running', title: 'Em andamento', description: 'Registrados no SIGAA. A turma trabalha com a organização.' },
  { stage: 'done', title: 'Concluídos', description: 'O resultado de cada um está no histórico da organização.' },
];

const ProjectGroups = () => {
  const { byStage, total, today, isPending, error, refetch } = useProjectsList();

  if (isPending) return <LoadingState />;
  if (error || !today) return <ErrorState error={error} onRetry={refetch} />;

  if (total === 0) {
    return (
      <EmptyState
        title="Nenhum projeto ainda"
        description="Um projeto nasce quando você leva uma demanda para uma das suas disciplinas."
        action={
          <Link to={paths.menu} className={buttonClassName({ variant: 'primary' })}>
            Abrir o cardápio
          </Link>
        }
      />
    );
  }

  return (
    <>
      {GROUPS.filter((group) => byStage[group.stage].length > 0).map((group) => (
        <Section key={group.stage} title={group.title} description={group.description}>
          <GroupedList>
            {byStage[group.stage].map((project) => (
              <ProjectRow key={project.id} project={project} today={today} />
            ))}
          </GroupedList>
        </Section>
      ))}
    </>
  );
};

export const ProjectsPage = () => (
  <Page title="Projetos" subtitle="Cada projeto é uma demanda levada para uma disciplina. Todos passam pelas mesmas seis etapas.">
    <ProjectGroups />
  </Page>
);
