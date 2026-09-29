import { LoadingState } from '@/components/feedback/queryStates';
import { EmptyState } from '@/components/ui/emptyState';
import { FolderIcon } from '@/components/ui/icons';
import { AnchorIcon, Item, ItemList } from '@/components/ui/itemList';
import { Page, Section } from '@/components/ui/page';
import { StatusLabel } from '@/components/ui/statusLabel';
import { projectStage } from '@/domain/projectLifecycle';
import { MilestoneTrack } from '@/features/projects/shared/components/milestoneTrack';
import { STAGE_COPY } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { SubmitDemandLink } from './components/submitDemandLink';
import type { OrgProjectSummary } from './types';
import { useOrgProjects } from './useOrgPortal';

const ProjectRow = ({ project }: { project: OrgProjectSummary }) => {
  const stage = STAGE_COPY[projectStage(project.milestones)];
  return (
    <Item
      to={paths.orgProject(project.id)}
      label={project.title}
      anchor={
        <AnchorIcon>
          <FolderIcon size={18} />
        </AnchorIcon>
      }
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="min-w-0 text-[15px] font-semibold text-ink">{project.title}</p>
        <StatusLabel tone={stage.tone}>{stage.label}</StatusLabel>
      </div>
      <p className="mt-1 text-sm text-ink-2">
        {project.disciplineName} · {project.teacherName} · {project.semester}
      </p>
      <MilestoneTrack milestones={project.milestones} className="mt-2.5 max-w-[360px]" />
    </Item>
  );
};

const TITLE = 'Projetos';
const SUBTITLE = 'As turmas que trabalham, ou já trabalharam, nos problemas de vocês.';

export const OrgProjectsPage = () => {
  const { data: projects } = useOrgProjects();

  if (!projects) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <LoadingState />
      </Page>
    );
  }

  const running = projects.filter((project) => projectStage(project.milestones) !== 'done');
  const done = projects.filter((project) => projectStage(project.milestones) === 'done');

  return (
    <Page title={TITLE} subtitle={SUBTITLE}>
      {projects.length === 0 ? (
        <EmptyState
          title="Nenhum projeto ainda"
          description="Quando um docente levar uma demanda de vocês para uma disciplina, o projeto aparece aqui, com as etapas e o contato do docente."
          action={<SubmitDemandLink />}
        />
      ) : (
        <>
          <Section title="Em curso" compact>
            {running.length > 0 ? (
              <ItemList>
                {running.map((project) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </ItemList>
            ) : (
              <p className="text-sm text-ink-2">Nenhuma turma trabalhando com vocês neste semestre.</p>
            )}
          </Section>
          {done.length > 0 && (
            <Section title="Concluídos" compact>
              <ItemList>
                {done.map((project) => (
                  <ProjectRow key={project.id} project={project} />
                ))}
              </ItemList>
            </Section>
          )}
        </>
      )}
    </Page>
  );
};
