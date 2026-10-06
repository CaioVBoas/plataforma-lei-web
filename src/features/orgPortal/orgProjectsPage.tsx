import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { FilterSelect, SearchInput } from '@/components/ui/formControls';
import { GroupCard, GroupRow } from '@/components/ui/groupCard';
import { CheckIcon, ClockIcon, FolderIcon } from '@/components/ui/icons';
import { Page } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import { formatRelativeDays } from '@/domain/calendar';
import { isOverdue, nextMilestone, projectStage, type ProjectStage } from '@/domain/projectLifecycle';
import type { IsoDate } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { STAGE_COPY } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { normalizeText, pluralize } from '@/utils/format';
import { SubmitDemandLink } from './components/submitDemandLink';
import type { OrgProjectSummary } from './types';
import { useOrgProjects } from './useOrgPortal';
import { ORG_MILESTONE_COPY } from './utils/orgPresentation';

type Filter = 'todos' | 'planejamento' | 'andamento' | 'concluidos';

const GROUPS: { filter: Exclude<Filter, 'todos'>; stage: ProjectStage; title: string; subtitle: string; empty: string }[] = [
  { filter: 'planejamento', stage: 'planning', title: 'Em planejamento', subtitle: 'O docente revisa o plano e combina a abertura com vocês', empty: 'Nenhum projeto começando agora.' },
  { filter: 'andamento', stage: 'running', title: 'Em andamento', subtitle: 'A turma está trabalhando, com entrega parcial e final', empty: 'Nenhuma turma trabalhando com vocês agora.' },
  { filter: 'concluidos', stage: 'done', title: 'Concluídos', subtitle: 'O que cada turma entregou', empty: 'Os projetos encerrados ficam aqui.' },
];

const FILTERS: Filter[] = ['todos', ...GROUPS.map((group) => group.filter)];

/** A próxima etapa do lado da organização, em pílula: atrasada em laranja escuro, perto em azul. */
const NextStepTag = ({ project, today }: { project: OrgProjectSummary; today: IsoDate }) => {
  const next = nextMilestone(project.milestones);
  if (!next) {
    return (
      <Tag pill tone="positive" icon={<CheckIcon size={13} />}>
        {STAGE_COPY.done.label}
      </Tag>
    );
  }
  const overdue = isOverdue(next, today);
  return (
    <Tag pill tone={overdue ? 'caution' : 'accent'} icon={<ClockIcon size={13} />}>
      {ORG_MILESTONE_COPY[next.id].title}, {overdue ? 'atrasada ' : ''}
      {formatRelativeDays(today, next.dueAt)}
    </Tag>
  );
};

const TITLE = 'Projetos';
const SUBTITLE = 'As turmas que trabalham, ou já trabalharam, nos problemas de vocês.';

export const OrgProjectsPage = () => {
  const { data: projects } = useOrgProjects();
  const { data: calendar } = useCalendar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

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
  const term = normalizeText(search.trim());
  const matches = (project: OrgProjectSummary) =>
    !term || normalizeText(`${project.title} ${project.disciplineName} ${project.teacherName}`).includes(term);
  const groups = GROUPS.filter((group) => filter === 'todos' || group.filter === filter).map((group) => ({
    ...group,
    index: GROUPS.indexOf(group) + 1,
    items: projects.filter((project) => projectStage(project.milestones) === group.stage && matches(project)),
  }));
  const found = groups.some((group) => group.items.length > 0);

  return (
    <Page title={TITLE} subtitle={SUBTITLE}>
      <div className="mb-5 flex flex-wrap gap-3">
        <SearchInput
          aria-label="Buscar projetos"
          placeholder="Buscar projeto, disciplina ou docente"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          containerClassName="min-w-0 flex-[1_1_320px]"
          className="h-10 border-line-strong bg-surface"
        />
        <FilterSelect
          label="Situação"
          value={filter}
          onChange={(next) => setSearchParams(next === 'todos' ? {} : { estado: next }, { replace: true })}
          options={[{ value: 'todos', label: 'Todos' }, ...GROUPS.map((group) => ({ value: group.filter, label: group.title }))]}
          className="w-full sm:w-[230px]"
        />
      </div>

      {!found && term ? (
        <EmptyState title="Nada encontrado" description={`Nenhum projeto com "${search.trim()}".`} />
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.filter}
              index={group.index}
              title={group.title}
              subtitle={group.subtitle}
              status={group.items.length > 0 ? <Tag pill>{pluralize(group.items.length, 'projeto', 'projetos')}</Tag> : undefined}
              defaultOpen={group.items.length > 0}
            >
              {group.items.length > 0 ? (
                group.items.map((project) => (
                  <GroupRow
                    key={project.id}
                    to={paths.orgProject(project.id)}
                    label={project.title}
                    icon={<FolderIcon size={17} />}
                    title={project.title}
                    meta={`${project.disciplineName} · ${project.teacherName} · ${project.semester}`}
                    status={<NextStepTag project={project} today={calendar.today} />}
                    action={
                      <Link to={paths.orgProject(project.id)} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>
                        Abrir
                      </Link>
                    }
                  />
                ))
              ) : (
                <li className="px-4 py-4 text-sm text-ink-3 sm:px-6">{term ? 'Nada com essa busca neste grupo.' : group.empty}</li>
              )}
            </GroupCard>
          ))}
        </div>
      )}
    </Page>
  );
};
