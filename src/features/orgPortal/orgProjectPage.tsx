import { Link, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { CoverBanner } from '@/components/ui/coverBanner';
import { ArrowRightIcon } from '@/components/ui/icons';
import { FactGrid, Page, Section } from '@/components/ui/page';
import { SideCard, SideFact } from '@/components/ui/sideCard';
import { StatusLabel } from '@/components/ui/statusLabel';
import { nextMilestone, projectStage } from '@/domain/projectLifecycle';
import { useCalendar } from '@/features/calendar/useCalendar';
import { MilestoneTimeline } from '@/features/projects/shared/components/milestoneTimeline';
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
  const cover = profile && demandCover(project.demandId, profile.organization.id, profile.organization.cover);

  return (
    <Page
      title={project.title}
      eyebrow={`${project.disciplineName} · ${project.semester}`}
      meta={<StatusLabel tone={stage.tone}>{stage.label}</StatusLabel>}
      back={{ to: paths.orgProjects, label: 'Projetos' }}
    >
      {cover && <CoverBanner cover={cover} />}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <FactGrid
            items={[
              { label: 'Disciplina', value: project.disciplineName },
              { label: 'Docente', value: project.teacherName },
              { label: 'Semestre', value: project.semester },
              { label: 'Equipes', value: pluralize(project.teams, 'equipe', 'equipes') },
            ]}
          />

          {next && (
            <section className="mt-8 rounded-lg border border-line p-5">
              <p className="text-[13px] font-semibold text-brand-strong">Próximo passo</p>
              <p className="mt-1.5 text-headline">{ORG_MILESTONE_COPY[next.id].title}</p>
              <p className={cn('mt-0.5 text-[13px]', next.dueAt < today ? 'text-caution' : 'text-ink-3')}>{milestoneDateLine(next, today, true)}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{ORG_MILESTONE_COPY[next.id].description}</p>
            </section>
          )}

          {project.outcome && (
            <section className="mt-8 rounded-lg border border-fact-line bg-fact p-5">
              <p className="text-[13px] font-semibold text-fact-label">O que ficou com vocês</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{project.outcome.summary}</p>
              <p className="mt-2 text-[13px] text-ink-2">{ADOPTION_COPY[project.outcome.adoption]}.</p>
            </section>
          )}

          <Section title="Etapas" description="As mesmas seis etapas de todo projeto. O docente registra cada uma; vocês acompanham por aqui.">
            <MilestoneTimeline milestones={project.milestones} today={today} copy={ORG_MILESTONE_COPY} />
          </Section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
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
