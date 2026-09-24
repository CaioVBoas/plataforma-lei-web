import type { MouseEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorState, LoadingState } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { ActionMenu } from '@/components/ui/actionMenu';
import { buttonClassName, textLinkClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { formatRelativeDays, formatShortDate } from '@/domain/calendar';
import type { ProjectStage } from '@/domain/projectLifecycle';
import type { IsoDate, Project } from '@/domain/types';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { MILESTONE_COPY, STAGE_COPY } from '../shared/utils/projectPresentation';
import { useProjectsList, type ProjectListItem } from './useProjectsList';

type Filter = 'todos' | 'planejamento' | 'andamento' | 'concluidos' | 'atrasados';

const STAGE_BY_FILTER: Partial<Record<Filter, ProjectStage>> = { planejamento: 'planning', andamento: 'running', concluidos: 'done' };

const FILTERS: Filter[] = ['todos', 'planejamento', 'andamento', 'concluidos', 'atrasados'];

const matchesFilter = (item: ProjectListItem, filter: Filter) => {
  if (filter === 'todos') return true;
  if (filter === 'atrasados') return item.overdue;
  return item.stage === STAGE_BY_FILTER[filter];
};

/** O plano inteiro, seção por seção, no formato em que é colado no SIGAA. */
const planText = (project: Project) => project.plan.map((section) => `${section.title}\n\n${section.text}`).join('\n\n');

/** A próxima etapa em poucas palavras: "em 7 dias", "atrasada há 3 dias". */
const nextStep = ({ next, overdue }: ProjectListItem, today: IsoDate) =>
  next && { title: MILESTONE_COPY[next.id].title, when: `${overdue ? 'atrasada ' : ''}${formatRelativeDays(today, next.dueAt)}` };

const HEADER_CELL = 'px-3 pb-2.5 text-[11px] font-semibold tracking-[0.04em] text-ink-2 uppercase';

const ProjectTableRow = ({ item, today }: { item: ProjectListItem; today: IsoDate }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { copy } = useCopyToClipboard();
  const { project } = item;
  const step = nextStep(item, today);

  // A linha inteira abre o projeto; links e botões dentro dela cuidam do próprio clique.
  const openFromRow = (event: MouseEvent<HTMLTableRowElement>) => {
    if ((event.target as HTMLElement).closest('a, button')) return;
    navigate(paths.project(project.id));
  };

  const copyPlan = () => copy('plan', planText(project)).then(() => toast.show('Plano copiado. Cole seção por seção no SIGAA.'));

  return (
    <tr onClick={openFromRow} className="h-16 cursor-pointer transition-colors duration-150 hover:bg-canvas">
      <td className="px-3 py-3">
        <p className="line-clamp-2 text-sm font-medium text-ink">{project.title}</p>
        <p className="mt-0.5 truncate text-xs text-ink-3">{project.organization.name}</p>
      </td>
      <td className="px-3 py-3">
        <p className="line-clamp-2 text-sm text-ink">{project.disciplineName}</p>
      </td>
      <td className="px-3 py-3">
        {step ? (
          <>
            <p className="text-sm font-medium text-ink">{step.title}</p>
            <p className={cn('mt-0.5 text-xs', item.overdue ? 'text-caution' : 'text-ink-3')}>{step.when}</p>
          </>
        ) : (
          <p className="text-sm font-medium text-ink">{STAGE_COPY.done.label}</p>
        )}
      </td>
      <td className="px-3 py-3 text-right text-sm whitespace-nowrap text-ink-2 tabular-nums">{item.date && formatShortDate(item.date)}</td>
      <td className="py-3 pr-1 pl-3">
        <div className="flex items-center justify-end gap-1">
          <Link to={paths.project(project.id)} className={buttonClassName({ variant: 'secondary' })}>
            Abrir
          </Link>
          <ActionMenu
            label={`Ações de ${project.title}`}
            items={[
              { label: 'Copiar plano', onSelect: copyPlan },
              { label: 'Ver organização', onSelect: () => navigate(paths.organization(project.organization.id)) },
            ]}
          />
        </div>
      </td>
    </tr>
  );
};

const ProjectTable = ({ items, today }: { items: ProjectListItem[]; today: IsoDate }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
      <colgroup>
        <col className="w-[38%]" />
        <col className="w-[20%]" />
        <col className="w-[19%]" />
        <col className="w-[11%]" />
        <col className="w-[128px]" />
      </colgroup>
      <thead>
        <tr className="border-b border-line">
          <th scope="col" className={HEADER_CELL}>
            Projeto
          </th>
          <th scope="col" className={HEADER_CELL}>
            Disciplina
          </th>
          <th scope="col" className={HEADER_CELL}>
            Próxima etapa
          </th>
          <th scope="col" className={cn(HEADER_CELL, 'text-right')}>
            Data
          </th>
          <th scope="col" className={cn(HEADER_CELL, 'text-right')}>
            <span className="sr-only">Ações</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line border-b border-line">
        {items.map((item) => (
          <ProjectTableRow key={item.project.id} item={item} today={today} />
        ))}
      </tbody>
    </table>
  </div>
);

const ProjectsView = () => {
  const { items, today, isPending, error, refetch } = useProjectsList();
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get('estado') as Filter | null;
  const overdueCount = items.filter((item) => item.overdue).length;
  // "Com atraso" só existe como aba enquanto houver atraso; um link antigo cai em Todos.
  const filter: Filter = requested && FILTERS.includes(requested) && (requested !== 'atrasados' || overdueCount > 0) ? requested : 'todos';
  const setFilter = (value: Filter) => setSearchParams(value === 'todos' ? {} : { estado: value }, { replace: true });

  if (isPending) return <LoadingState />;
  if (error || !today) return <ErrorState error={error} onRetry={refetch} />;

  if (items.length === 0) {
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

  const count = (value: Filter) => items.filter((item) => matchesFilter(item, value)).length;
  const visible = items.filter((item) => matchesFilter(item, filter));

  return (
    <>
      <UnderlineTabs
        label="Estado dos projetos"
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'todos', label: 'Todos', count: items.length },
          { value: 'planejamento', label: 'Em planejamento', count: count('planejamento') },
          { value: 'andamento', label: 'Em andamento', count: count('andamento') },
          { value: 'concluidos', label: 'Concluídos', count: count('concluidos') },
          ...(overdueCount > 0 ? [{ value: 'atrasados' as const, label: 'Com atraso', count: overdueCount }] : []),
        ]}
      />

      {overdueCount > 0 && filter !== 'atrasados' && (
        <p className="mt-4 text-sm text-ink-2">
          {overdueCount === 1 ? '1 projeto atrasado, ' : `${pluralize(overdueCount, 'projeto atrasado', 'projetos atrasados')}, `}
          <button type="button" onClick={() => setFilter('atrasados')} className={textLinkClassName}>
            {overdueCount === 1 ? 'ver qual' : 'ver quais'}
          </button>
          .
        </p>
      )}

      <div className="mt-4">
        {visible.length > 0 ? <ProjectTable items={visible} today={today} /> : <p className="py-6 text-sm text-ink-3">Nenhum projeto neste estado.</p>}
      </div>
    </>
  );
};

export const ProjectsPage = () => (
  <Page title="Projetos" subtitle="Todos passam pelas mesmas seis etapas, do plano ao encerramento.">
    <ProjectsView />
  </Page>
);
