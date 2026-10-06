import type { MouseEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { Page } from '@/components/ui/page';
import { StatTiles } from '@/components/ui/profileHeader';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { formatRelativeDays, formatShortDate } from '@/domain/calendar';
import { isOverdue, nextMilestone, projectStage, type ProjectStage } from '@/domain/projectLifecycle';
import type { IsoDate } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { STAGE_COPY } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { SubmitDemandLink } from './components/submitDemandLink';
import type { OrgProjectSummary } from './types';
import { useOrgProjects } from './useOrgPortal';
import { ORG_MILESTONE_COPY } from './utils/orgPresentation';

type Filter = 'todos' | 'planejamento' | 'andamento' | 'concluidos';

const FILTERS: Filter[] = ['todos', 'planejamento', 'andamento', 'concluidos'];
const STAGE_BY_FILTER: Record<Exclude<Filter, 'todos'>, ProjectStage> = { planejamento: 'planning', andamento: 'running', concluidos: 'done' };
const STAGE_ORDER: Record<ProjectStage, number> = { planning: 0, running: 1, done: 2 };

interface Row {
  project: OrgProjectSummary;
  stage: ProjectStage;
  next?: ReturnType<typeof nextMilestone>;
  overdue: boolean;
  /** O prazo da próxima etapa ou o dia do encerramento. */
  date?: IsoDate;
}

const toRows = (projects: OrgProjectSummary[], today: IsoDate): Row[] =>
  projects
    .map((project) => {
      const next = nextMilestone(project.milestones);
      return {
        project,
        stage: projectStage(project.milestones),
        next,
        overdue: next ? isOverdue(next, today) : false,
        date: next ? next.dueAt : project.milestones.find((milestone) => milestone.id === 'closing')?.doneAt,
      };
    })
    .sort((a, b) => STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage] || (a.stage === 'done' ? -1 : 1) * (a.date ?? '').localeCompare(b.date ?? ''));

const HEADER_CELL = 'px-3 pb-2.5 text-[11px] font-semibold tracking-[0.04em] text-ink-2 uppercase';

/** Mesma tabela do portal do docente, com o docente no lugar da organização e as etapas contadas do lado de vocês. */
const ProjectTableRow = ({ row, today }: { row: Row; today: IsoDate }) => {
  const navigate = useNavigate();
  const { project, next, overdue } = row;
  const openFromRow = (event: MouseEvent<HTMLTableRowElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) return;
    navigate(paths.orgProject(project.id));
  };

  return (
    <tr onClick={openFromRow} className="h-16 cursor-pointer transition-colors duration-150 hover:bg-canvas">
      <td className="px-3 py-3">
        <p className="line-clamp-2 text-sm font-medium text-ink">{project.title}</p>
        <p className="mt-0.5 truncate text-xs text-ink-3">
          {project.disciplineName} · {project.semester}
        </p>
      </td>
      <td className="px-3 py-3">
        <p className="line-clamp-2 text-sm text-ink">{project.teacherName}</p>
      </td>
      <td className="px-3 py-3">
        {next ? (
          <>
            <p className="text-sm font-medium text-ink">{ORG_MILESTONE_COPY[next.id].title}</p>
            <p className={cn('mt-0.5 text-xs', overdue ? 'text-caution' : 'text-ink-3')}>
              {overdue ? 'atrasada ' : ''}
              {formatRelativeDays(today, next.dueAt)}
            </p>
          </>
        ) : (
          <p className="text-sm font-medium text-ink">{STAGE_COPY.done.label}</p>
        )}
      </td>
      <td className="px-3 py-3 text-right text-sm whitespace-nowrap text-ink-2 tabular-nums">{row.date && formatShortDate(row.date)}</td>
      <td className="py-3 pr-1 pl-3 text-right">
        <Link to={paths.orgProject(project.id)} className={buttonClassName({ variant: 'secondary' })}>
          Abrir
        </Link>
      </td>
    </tr>
  );
};

const ProjectTable = ({ rows, today }: { rows: Row[]; today: IsoDate }) => (
  <div className="relative overflow-x-auto">
    <table className="w-full min-w-[720px] table-fixed border-collapse text-left">
      <colgroup>
        <col className="w-[40%]" />
        <col className="w-[20%]" />
        <col className="w-[22%]" />
        <col className="w-[12%]" />
        <col className="w-[96px]" />
      </colgroup>
      <thead>
        <tr className="border-b border-line">
          <th scope="col" className={HEADER_CELL}>
            Projeto
          </th>
          <th scope="col" className={HEADER_CELL}>
            Docente
          </th>
          <th scope="col" className={HEADER_CELL}>
            Próxima etapa
          </th>
          <th scope="col" className={cn(HEADER_CELL, 'text-right')}>
            Data
          </th>
          <th scope="col" className={HEADER_CELL}>
            <span className="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line border-b border-line">
        {rows.map((row) => (
          <ProjectTableRow key={row.project.id} row={row} today={today} />
        ))}
      </tbody>
    </table>
  </div>
);

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
  const setFilter = (value: Filter) => setSearchParams(value === 'todos' ? {} : { estado: value }, { replace: true });
  const rows = toRows(projects, calendar.today);
  const matches = (row: Row, value: Filter) => value === 'todos' || row.stage === STAGE_BY_FILTER[value];
  const count = (value: Filter) => rows.filter((row) => matches(row, value)).length;
  const visible = rows.filter((row) => matches(row, filter));
  // O prazo mais próximo entre todos, não o do primeiro da lista: a ordem agrupa por estado.
  const nextDue = rows.flatMap((row) => (row.next ? [row.next.dueAt] : [])).sort()[0];

  return (
    <Page title={TITLE} subtitle={SUBTITLE}>
      <div className="mb-8">
        <StatTiles
          items={[
            { value: count('planejamento'), label: 'em planejamento' },
            { value: count('andamento'), label: 'em andamento' },
            { value: count('concluidos'), label: count('concluidos') === 1 ? 'concluído' : 'concluídos' },
            { value: nextDue ? formatShortDate(nextDue) : '–', label: 'próximo prazo' },
          ]}
        />
      </div>
      <UnderlineTabs
        label="Estado dos projetos"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'todos', label: 'Todos', count: rows.length },
          { value: 'planejamento', label: 'Em planejamento', count: count('planejamento') },
          { value: 'andamento', label: 'Em andamento', count: count('andamento') },
          { value: 'concluidos', label: 'Concluídos', count: count('concluidos') },
        ]}
      />
      <div className="mt-4">
        {visible.length > 0 ? <ProjectTable rows={visible} today={calendar.today} /> : <p className="py-6 text-sm text-ink-3">Nenhum projeto neste estado.</p>}
      </div>
    </Page>
  );
};
