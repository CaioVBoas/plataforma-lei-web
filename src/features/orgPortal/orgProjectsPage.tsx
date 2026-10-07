import { Link, useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { cardGridClassName } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/emptyState';
import { ChoiceBar } from '@/components/ui/choiceBar';
import { CalendarIcon, CheckIcon, FolderIcon, ListIcon, PencilIcon } from '@/components/ui/icons';
import { InfoBanner } from '@/components/ui/infoBanner';
import { Page } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import { formatRelativeDays, formatShortDate } from '@/domain/calendar';
import { isOverdue, nextMilestone, projectStage, type ProjectStage } from '@/domain/projectLifecycle';
import type { IsoDate } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { MilestoneTrack } from '@/features/projects/shared/components/milestoneTrack';
import { STAGE_COPY } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { SubmitDemandLink } from './components/submitDemandLink';
import type { OrgProjectSummary } from './types';
import { useOrgProjects } from './useOrgPortal';
import { ORG_FACING_MILESTONES, ORG_MILESTONE_COPY } from './utils/orgPresentation';

type Filter = 'todos' | 'planejamento' | 'andamento' | 'concluidos';

const FILTERS: Filter[] = ['todos', 'planejamento', 'andamento', 'concluidos'];
const STAGE_BY_FILTER: Record<Exclude<Filter, 'todos'>, ProjectStage> = { planejamento: 'planning', andamento: 'running', concluidos: 'done' };
const LABELS: Record<Filter, string> = { todos: 'Todos', planejamento: 'Em planejamento', andamento: 'Em andamento', concluidos: 'Concluídos' };
const ICONS: Record<Filter, typeof ListIcon> = { todos: ListIcon, planejamento: PencilIcon, andamento: CalendarIcon, concluidos: CheckIcon };

const HELP: Record<Filter, string> = {
  todos: 'Cada projeto é uma turma do CIn trabalhando num problema de vocês durante um semestre. Todos passam pelas mesmas seis etapas.',
  planejamento: 'O docente está revisando o plano e vai marcar a reunião de abertura com vocês.',
  andamento: 'A turma está trabalhando. Vocês participam da entrega parcial e da entrega final.',
  concluidos: 'Projetos que já terminaram, com o que ficou com vocês.',
};

/** Um projeto em cartão: estado, quem faz, o andamento em seis traços e o próximo passo em palavras simples. */
const OrgProjectCard = ({ project, today }: { project: OrgProjectSummary; today: IsoDate }) => {
  const stage = STAGE_COPY[projectStage(project.milestones)];
  const next = nextMilestone(project.milestones);
  const overdue = next ? isOverdue(next, today) : false;
  const withYou = next ? ORG_FACING_MILESTONES.includes(next.id) : false;

  return (
    <article className="flex h-full min-w-0 flex-col rounded-lg border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tag pill tone={stage.tone}>
          {stage.label}
        </Tag>
        {withYou && <span className="text-[13px] font-semibold text-accent">Com a participação de vocês</span>}
      </div>
      <h3 className="mt-3 text-[17px] leading-snug font-semibold tracking-[-0.01em] text-ink">{project.title}</h3>
      <p className="mt-1 text-sm text-ink-2">
        {project.disciplineName}, com {project.teacherName} · {project.semester}
      </p>
      <MilestoneTrack milestones={project.milestones} className="mt-4" />

      <div className="mt-auto pt-5">
        <p className="rounded-md bg-canvas px-3.5 py-2.5 text-sm leading-relaxed text-ink">
          <span className="font-semibold">{next ? 'Próximo passo: ' : 'Resultado: '}</span>
          {next ? (
            <>
              {ORG_MILESTONE_COPY[next.id].title},{' '}
              <span className={cn(overdue && 'font-semibold text-caution')}>
                {overdue ? 'atrasado, era para ' : 'até '}
                {formatShortDate(next.dueAt)} ({formatRelativeDays(today, next.dueAt)})
              </span>
              .
            </>
          ) : (
            (project.outcome?.summary ?? 'Projeto concluído.')
          )}
        </p>
        <Link to={paths.orgProject(project.id)} className={cn(buttonClassName({ variant: 'secondary', size: 'xl', fullWidth: true }), 'mt-3')}>
          <FolderIcon size={20} />
          Abrir o projeto
        </Link>
      </div>
    </article>
  );
};

const TITLE = 'Projetos';
const SUBTITLE = 'As turmas que trabalham, ou já trabalharam, nos problemas de vocês.';

export const OrgProjectsPage = () => {
  const { data: projects } = useOrgProjects();
  const { data: calendar } = useCalendar();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!projects || !calendar) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <LoadingState />
      </Page>
    );
  }

  if (projects.length === 0) {
    return (
      <Page title={TITLE} subtitle={SUBTITLE}>
        <EmptyState
          title="Nenhum projeto ainda"
          description="Quando um docente levar uma demanda de vocês para uma disciplina, o projeto aparece aqui, com as etapas e o contato do docente."
          action={<SubmitDemandLink />}
        />
      </Page>
    );
  }

  const requested = searchParams.get('estado') as Filter | null;
  const filter: Filter = requested && FILTERS.includes(requested) ? requested : 'todos';
  const matches = (project: OrgProjectSummary, value: Filter) => value === 'todos' || projectStage(project.milestones) === STAGE_BY_FILTER[value];
  const count = (value: Filter) => projects.filter((project) => matches(project, value)).length;
  // Primeiro o que está em curso, depois os concluídos, do mais recente ao mais antigo.
  const visible = projects
    .filter((project) => matches(project, filter))
    .sort((a, b) => Number(projectStage(a.milestones) === 'done') - Number(projectStage(b.milestones) === 'done') || b.semester.localeCompare(a.semester));

  return (
    <Page title={TITLE} subtitle={SUBTITLE}>
      <ChoiceBar
        label="Estado dos projetos"
        value={filter}
        onChange={(value) => setSearchParams(value === 'todos' ? {} : { estado: value }, { replace: true })}
        options={FILTERS.map((value) => {
          const Icon = ICONS[value];
          return { value, label: LABELS[value], icon: <Icon size={20} />, count: count(value) };
        })}
        className="mb-4"
      />
      <InfoBanner className="mb-6">{HELP[filter]}</InfoBanner>
      {visible.length > 0 ? (
        <ul className={cardGridClassName}>
          {visible.map((project) => (
            <li key={project.id}>
              <OrgProjectCard project={project} today={calendar.today} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={`Nada em "${LABELS[filter]}"`} description="Nenhum projeto neste estado agora." />
      )}
    </Page>
  );
};
