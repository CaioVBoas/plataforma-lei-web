import { Link, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { DetailHeader } from '@/components/ui/detailHeader';
import { CalendarIcon, CheckIcon, ClockIcon, MailIcon, TrayIcon, UserIcon, UsersIcon } from '@/components/ui/icons';
import { InfoBanner } from '@/components/ui/infoBanner';
import { Page } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import { completedCount, isOverdue, MILESTONE_ORDER, nextMilestone, projectStage } from '@/domain/projectLifecycle';
import { useCalendar } from '@/features/calendar/useCalendar';
import { MilestoneTimeline } from '@/features/projects/shared/components/milestoneTimeline';
import { MilestoneTrack } from '@/features/projects/shared/components/milestoneTrack';
import { ADOPTION_COPY, milestoneDateLine, STAGE_COPY } from '@/features/projects/shared/utils/projectPresentation';
import { demandCover } from '@/lib/covers';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import type { OrgProjectDetail } from './types';
import { useOrgProfile, useOrgProject } from './useOrgPortal';
import { ORG_MILESTONE_COPY } from './utils/orgPresentation';

/**
 * O projeto visto pela organização: em que etapa a turma está, o que vem a
 * seguir e com quem falar. O plano e as anotações ficam com o docente.
 */
const ProjectView = ({ project, today }: { project: OrgProjectDetail; today: string }) => {
  const stage = STAGE_COPY[projectStage(project.milestones)];
  const next = nextMilestone(project.milestones);
  const { data: profile } = useOrgProfile();
  const cover = profile ? demandCover(project.demandId, profile.organization.id, profile.organization.cover) : undefined;

  const overdue = next ? isOverdue(next, today) : false;

  const done = completedCount(project.milestones);

  return (
    <Page title={project.title} back={{ to: paths.orgProjects, label: 'Projetos' }} bare>
      <DetailHeader
        cover={cover}
        chips={
          <>
            <Tag pill tone={stage.tone}>
              {stage.label}
            </Tag>
            <Tag pill>Projeto de extensão · {project.semester}</Tag>
          </>
        }
        title={project.title}
        description={`${project.disciplineName}, com ${project.teacherName}.`}
        actions={
          <>
            {project.hasDemand && (
              <Link to={paths.orgDemand(project.demandId)} className={buttonClassName({ variant: 'secondary' })}>
                <TrayIcon size={15} />
                Ver a demanda
              </Link>
            )}
            <a href={`mailto:${project.teacherEmail}`} className={buttonClassName({ variant: 'primary' })}>
              <MailIcon size={15} />
              Escrever ao docente
            </a>
          </>
        }
        progress={{
          label: next ? `${done} de ${MILESTONE_ORDER.length} etapas feitas` : 'Todas as etapas feitas',
          bar: <MilestoneTrack milestones={project.milestones} />,
        }}
        facts={[
          {
            icon: <CalendarIcon size={17} />,
            label: 'Próxima etapa',
            value: next ? (
              <>
                {ORG_MILESTONE_COPY[next.id].title}
                <span className={cn('block text-[13px] font-normal', overdue ? 'text-caution' : 'text-ink-3')}>{milestoneDateLine(next, today, true)}</span>
              </>
            ) : (
              'Projeto encerrado'
            ),
          },
          {
            icon: <UserIcon size={17} />,
            label: 'Docente',
            value: (
              <>
                {project.teacherName}
                <a href={`mailto:${project.teacherEmail}`} className="block truncate text-[13px] font-normal text-accent hover:underline">
                  {project.teacherEmail}
                </a>
              </>
            ),
          },
          { icon: <UsersIcon size={17} />, label: 'Turma', value: `${project.disciplineName}, ${pluralize(project.teams, 'equipe', 'equipes')}` },
          { icon: <ClockIcon size={17} />, label: 'Semestre', value: project.semester },
        ]}
      />

      {next ? (
        <InfoBanner className="mt-6" tone={overdue ? 'caution' : 'neutral'} icon={<ClockIcon size={17} />}>
          <span className="font-semibold">Próximo passo: {ORG_MILESTONE_COPY[next.id].title}.</span> {ORG_MILESTONE_COPY[next.id].description}
        </InfoBanner>
      ) : (
        project.outcome && (
          <InfoBanner className="mt-6" tone="accent" icon={<CheckIcon size={17} />}>
            <span className="font-semibold">O que ficou com vocês:</span> {project.outcome.summary} {ADOPTION_COPY[project.outcome.adoption]}.
          </InfoBanner>
        )
      )}

      {(project.teacherPhone || project.coTeachers.length > 0) && (
        <p className="mt-3 px-1 text-[13px] text-ink-2">
          {project.teacherPhone && <>Telefone do docente: {project.teacherPhone}. </>}
          {project.coTeachers.length > 0 && <>Divide a disciplina com {project.coTeachers.join(', ')}.</>}
        </p>
      )}

      <section className="mt-8 rounded-xl border border-line bg-surface px-5 py-6 sm:px-8">
        <h2 className="text-headline">Etapas</h2>
        <p className="mt-1 mb-6 text-sm text-ink-2">As mesmas seis etapas de todo projeto. O docente registra cada uma; vocês acompanham por aqui.</p>
        <MilestoneTimeline milestones={project.milestones} today={today} copy={ORG_MILESTONE_COPY} />
      </section>
    </Page>
  );
};

export const OrgProjectPage = () => {
  const { projectId = '' } = useParams();
  const query = useOrgProject(projectId);
  const { data: calendar } = useCalendar();
  return <QueryView query={query}>{(project) => (calendar ? <ProjectView project={project} today={calendar.today} /> : null)}</QueryView>;
};
