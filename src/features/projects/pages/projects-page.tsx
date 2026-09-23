import { Link } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { buttonClassName } from '@/components/ui/button-styles';
import { EmptyState } from '@/components/ui/empty-state';
import { GroupedList } from '@/components/ui/grouped-list';
import { Page, Section } from '@/components/ui/page';
import { projectStage, type ProjectStage } from '@/domain/project-lifecycle';
import type { IsoDate, Project } from '@/domain/types';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { paths } from '@/routes/paths';
import { ProjectRow } from '../components/project-row';
import { useProjects } from '../hooks/use-projects';

/** Uma seção por estado, na ordem em que o projeto passa por eles. */
const GROUPS: { stage: ProjectStage; title: string; description: string }[] = [
  { stage: 'planning', title: 'Em planejamento', description: 'Plano, reunião de abertura e registro no SIGAA.' },
  { stage: 'running', title: 'Em andamento', description: 'Registrados no SIGAA. A turma trabalha com a organização.' },
  { stage: 'done', title: 'Concluídos', description: 'O resultado de cada um está no histórico da organização.' },
];

const ProjectGroups = ({ projects, today }: { projects: Project[]; today: IsoDate }) => {
  if (projects.length === 0) {
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
      {GROUPS.map((group) => {
        const inGroup = projects.filter((project) => projectStage(project.milestones) === group.stage);
        if (inGroup.length === 0) return null;
        return (
          <Section key={group.stage} title={group.title} description={group.description}>
            <GroupedList>
              {inGroup.map((project) => (
                <ProjectRow key={project.id} project={project} today={today} />
              ))}
            </GroupedList>
          </Section>
        );
      })}
    </>
  );
};

export const ProjectsPage = () => {
  const projectsQuery = useProjects();
  const calendarQuery = useCalendar();

  return (
    <Page title="Projetos" subtitle="Cada projeto é uma demanda levada para uma disciplina. Todos passam pelas mesmas seis etapas.">
      <QueryView query={projectsQuery}>
        {(projects) => <QueryView query={calendarQuery}>{(calendar) => <ProjectGroups projects={projects} today={calendar.today} />}</QueryView>}
      </QueryView>
    </Page>
  );
};
