import { useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { Tag } from '@/components/ui/tag';
import { projectStage } from '@/domain/projectLifecycle';
import type { Milestone, Project, SemesterCalendar } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useDiscipline } from '@/features/disciplines/useDisciplines';
import { joinWithAnd } from '@/utils/format';
import { paths, type ProjectTab } from '@/routes/paths';
import { CompleteMilestoneModal } from './components/completeMilestoneModal';
import { MilestoneTimeline } from './components/milestoneTimeline';
import { MilestoneTrack } from '../shared/components/milestoneTrack';
import { NextStepCard } from './components/nextStepCard';
import { OrganizationTab } from './components/organizationTab';
import { PlanTab } from './components/planTab';
import { ProjectSettings } from './components/projectSettings';
import { useProject } from './useProjectWorkspace';
import { STAGE_COPY } from '../shared/utils/projectPresentation';

const TABS: { value: ProjectTab; label: string }[] = [
  { value: 'etapas', label: 'Etapas' },
  { value: 'plano', label: 'Plano' },
  { value: 'organizacao', label: 'Organização' },
];

const isProjectTab = (value: string | null): value is ProjectTab => TABS.some((tab) => tab.value === value);

const ProjectView = ({ project, calendar }: { project: Project; calendar: SemesterCalendar }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('aba');
  const tab: ProjectTab = isProjectTab(requestedTab) ? requestedTab : 'etapas';
  const [completing, setCompleting] = useState<Milestone | null>(null);
  const stage = STAGE_COPY[projectStage(project.milestones)];
  const { data: discipline } = useDiscipline(project.disciplineId);
  const coTeachers = (discipline?.coTeachers ?? []).map((teacher) => teacher.name ?? teacher.email);

  const tabContentRef = useRef<HTMLDivElement>(null);

  const changeTab = (next: ProjectTab) => setSearchParams(next === 'etapas' ? {} : { aba: next }, { replace: true });

  // Revisar o plano acontece na aba Plano, então a ação leva até ele; as outras etapas se registram numa janela.
  const act = (milestone: Milestone) => {
    if (milestone.id !== 'plan') {
      setCompleting(milestone);
      return;
    }
    changeTab('plano');
    tabContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Page
      title={project.title}
      back={{ to: paths.projects, label: 'Projetos' }}
      subtitle={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Tag tone={stage.tone}>{stage.label}</Tag>
          <span>
            <Link to={paths.organization(project.organization.id)} className="hover:text-ink">
              {project.organization.name}
            </Link>
            {' · '}
            <Link to={paths.discipline(project.disciplineId)} className="hover:text-ink">
              {project.disciplineName}
            </Link>
            {` · ${project.semester}`}
          </span>
        </span>
      }
      meta={coTeachers.length > 0 ? `Coordenação compartilhada com ${joinWithAnd(coTeachers)}` : undefined}
    >
      <MilestoneTrack milestones={project.milestones} className="mb-5" />
      <NextStepCard project={project} today={calendar.today} onAct={act} />

      <div ref={tabContentRef} className="mt-10 mb-8 scroll-mt-16">
        <UnderlineTabs label="Seções do projeto" value={tab} options={TABS} onChange={changeTab} />
      </div>

      {tab === 'etapas' && (
        <>
          <MilestoneTimeline milestones={project.milestones} today={calendar.today} />
          <ProjectSettings project={project} />
        </>
      )}
      {tab === 'plano' && <PlanTab project={project} today={calendar.today} />}
      {tab === 'organizacao' && <OrganizationTab project={project} />}

      {completing && <CompleteMilestoneModal project={project} milestone={completing} today={calendar.today} onClose={() => setCompleting(null)} />}
    </Page>
  );
};

export const ProjectPage = () => {
  const { projectId = '' } = useParams();
  const projectQuery = useProject(projectId);
  const calendarQuery = useCalendar();

  return (
    <QueryView query={projectQuery}>
      {(project) => <QueryView query={calendarQuery}>{(calendar) => <ProjectView project={project} calendar={calendar} />}</QueryView>}
    </QueryView>
  );
};
