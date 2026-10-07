import { Link, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { CoverBanner } from '@/components/ui/coverBanner';
import { ArrowRightIcon, MailIcon } from '@/components/ui/icons';
import { Page } from '@/components/ui/page';
import { SideCard, SideFact } from '@/components/ui/sideCard';
import { Tag } from '@/components/ui/tag';
import { isOverdue, nextMilestone, projectStage } from '@/domain/projectLifecycle';
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
import { ORG_FACING_MILESTONES, ORG_MILESTONE_COPY } from './utils/orgPresentation';

/**
 * O projeto visto pela organização: em que etapa a turma está, o que vem a
 * seguir e com quem falar. O plano e as anotações ficam com o docente.
 */
const ProjectView = ({ project, today }: { project: OrgProjectDetail; today: string }) => {
  const stage = STAGE_COPY[projectStage(project.milestones)];
  const next = nextMilestone(project.milestones);
  const { data: profile } = useOrgProfile();
  const cover = profile && demandCover(project.demandId, profile.organization.id, profile.organization.cover);

  const overdue = next ? isOverdue(next, today) : false;

  return (
    <Page
      title={project.title}
      eyebrow={`Projeto de extensão · ${project.semester}`}
      back={{ to: paths.orgProjects, label: 'Projetos' }}
      subtitle={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Tag tone={stage.tone}>{stage.label}</Tag>
          <span>
            {project.disciplineName} · {project.teacherName} · {project.semester}
          </span>
        </span>
      }
    >
      {cover && <CoverBanner cover={cover} />}
      <MilestoneTrack milestones={project.milestones} className="mb-5" />

      {/* A mesma faixa do topo do projeto do docente, sem a ação: quem registra cada etapa é ele. */}
      {next ? (
        <section className="rounded-lg border border-line bg-canvas p-5 sm:p-6">
          <p className={cn('text-[13px] font-medium', overdue ? 'text-caution' : 'text-ink-3')}>Próximo passo · {milestoneDateLine(next, today, true)}</p>
          <p className="mt-1.5 text-headline">{ORG_MILESTONE_COPY[next.id].title}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">{ORG_MILESTONE_COPY[next.id].description}</p>
          <p className="mt-3 text-sm font-medium text-ink">
            {ORG_FACING_MILESTONES.includes(next.id)
              ? 'Esta etapa conta com vocês: o docente vai combinar a data pelo contato ao lado.'
              : 'Esta etapa é do docente. Vocês não precisam fazer nada agora.'}
          </p>
        </section>
      ) : (
        project.outcome && (
          <section className="rounded-lg border border-line bg-canvas p-5 sm:p-6">
            <p className="text-[13px] font-medium text-ink-3">O que ficou com vocês</p>
            <p className="mt-1.5 text-headline">{project.outcome.summary}</p>
            <p className="mt-1 text-sm text-ink-2">{ADOPTION_COPY[project.outcome.adoption]}.</p>
          </section>
        )
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <h2 className="text-headline">Etapas</h2>
          <p className="mt-1 mb-6 text-sm text-ink-2">As mesmas seis etapas de todo projeto. O docente registra cada uma; vocês acompanham por aqui.</p>
          <MilestoneTimeline milestones={project.milestones} today={today} copy={ORG_MILESTONE_COPY} />
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <SideCard title="Turma no projeto">
            <dl>
              <SideFact label="Disciplina">{project.disciplineName}</SideFact>
              <SideFact label="Equipes">{pluralize(project.teams, 'equipe', 'equipes')}</SideFact>
            </dl>
          </SideCard>
          <SideCard title="Docente responsável">
            <dl>
              <SideFact label="Nome">{project.teacherName}</SideFact>
              <SideFact label="E-mail">
                <a href={`mailto:${project.teacherEmail}`} className={textLinkClassName}>
                  {project.teacherEmail}
                </a>
              </SideFact>
              {project.teacherPhone && <SideFact label="Telefone">{project.teacherPhone}</SideFact>}
              {project.coTeachers.length > 0 && <SideFact label="Divide a disciplina com">{project.coTeachers.join(', ')}</SideFact>}
            </dl>
            <a href={`mailto:${project.teacherEmail}`} className={cn(buttonClassName({ variant: 'primary', size: 'xl', fullWidth: true }), 'mt-4')}>
              <MailIcon size={20} />
              Escrever ao docente
            </a>
          </SideCard>
          {project.hasDemand && (
            <Link to={paths.orgDemand(project.demandId)} className={buttonClassName({ variant: 'secondary', fullWidth: true })}>
              Ver a demanda
              <ArrowRightIcon size={15} />
            </Link>
          )}
        </aside>
      </div>
    </Page>
  );
};

export const OrgProjectPage = () => {
  const { projectId = '' } = useParams();
  const query = useOrgProject(projectId);
  const { data: calendar } = useCalendar();
  return <QueryView query={query}>{(project) => (calendar ? <ProjectView project={project} today={calendar.today} /> : null)}</QueryView>;
};
