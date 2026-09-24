import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { ActionMenu, type ActionMenuItem } from '@/components/ui/actionMenu';
import { Button } from '@/components/ui/button';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { PlusIcon } from '@/components/ui/icons';
import { aboveRowLink, Item, ItemList } from '@/components/ui/itemList';
import { Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { freeSlots } from '@/domain/disciplineRules';
import type { Demand, Project } from '@/domain/types';
import { useMenu } from '@/features/demands/useDemands';
import { useProjects } from '@/features/projects/shared/hooks/useProjects';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { NewDisciplineModal } from './components/newDisciplineModal';
import { useDisciplines, useRemoveDiscipline } from './useDisciplines';
import type { DisciplineWithUsage } from './types';
import { disciplineFacts, slotsLabel } from './utils/disciplinePresentation';
import { matchingDemands } from './utils/matchingDemands';

type SemesterTab = 'atual' | 'anteriores';

interface DisciplineItemProps {
  discipline: DisciplineWithUsage;
  matches: number;
  projects: number;
}

/** Três linhas: nome, fatos da turma e ocupação. Ementa, competências e formulário ficam no detalhe. */
const DisciplineItem = ({ discipline, matches, projects }: DisciplineItemProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const remove = useRemoveDiscipline();

  const actions: ActionMenuItem[] = [];
  // Só turmas do semestre atual têm formulário; as antigas guardam o histórico como está.
  if (discipline.isCurrent) actions.push({ label: 'Editar', onSelect: () => navigate(paths.disciplineEdit(discipline.id)) });
  if (projects === 0) {
    actions.push({
      label: 'Remover',
      destructive: true,
      onSelect: () =>
        remove.mutate(discipline.id, {
          onSuccess: () => toast.show(`${discipline.name} removida.`),
          onError: (error) => toast.show(error.message),
        }),
    });
  }

  const matchesText = pluralize(matches, 'demanda compatível', 'demandas compatíveis');

  return (
    <Item
      to={paths.discipline(discipline.id)}
      label={discipline.name}
      anchor={<span className="pt-1 text-[13px] whitespace-nowrap text-ink-2 tabular-nums">{discipline.code || '—'}</span>}
      menu={<ActionMenu label={`Ações de ${discipline.name}`} items={actions} />}
    >
      <p className="truncate text-headline">{discipline.name}</p>
      <p className="mt-1 truncate text-[13px] text-ink-2">
        {discipline.isCurrent ? disciplineFacts(discipline) : `${discipline.semester} · ${disciplineFacts(discipline)}`}
      </p>
      <p className="mt-1 truncate text-[13px] text-ink-2">
        {discipline.isCurrent ? (
          <>
            <span className={freeSlots(discipline) === 0 ? 'text-ink-3' : undefined}>{slotsLabel(discipline)}</span>
            <span aria-hidden="true"> · </span>
            {matches === 0 ? (
              <span className="text-ink-3">{matchesText}</span>
            ) : (
              <Link to={paths.disciplineMatches(discipline.id)} className={cn(textLinkClassName, aboveRowLink)}>
                {matchesText}
              </Link>
            )}
          </>
        ) : (
          <span className={projects === 0 ? 'text-ink-3' : undefined}>{projects === 0 ? 'Nenhum projeto' : pluralize(projects, 'projeto', 'projetos')}</span>
        )}
      </p>
    </Item>
  );
};

interface GroupsProps {
  disciplines: DisciplineWithUsage[];
  menu: Demand[];
  projects: Project[];
  tab: SemesterTab;
  onCreate: () => void;
}

const DisciplineList = ({ disciplines, menu, projects, tab, onCreate }: GroupsProps) => {
  const visible = disciplines.filter((discipline) => discipline.isCurrent === (tab === 'atual'));

  if (visible.length === 0) {
    return tab === 'atual' ? (
      <EmptyState
        title="Nenhuma disciplina neste semestre"
        description="Cadastre as turmas que você leciona agora. Sem elas, não dá para saber quais demandas combinam com você."
        action={
          <Button variant="primary" onClick={onCreate}>
            Cadastrar disciplina
          </Button>
        }
      />
    ) : (
      <p className="py-6 text-sm text-ink-3">Nenhuma disciplina de semestres anteriores.</p>
    );
  }

  return (
    <ItemList flush>
      {visible.map((discipline) => (
        <DisciplineItem
          key={discipline.id}
          discipline={discipline}
          matches={discipline.isCurrent ? matchingDemands(menu, discipline).length : 0}
          projects={projects.filter((project) => project.disciplineId === discipline.id).length}
        />
      ))}
    </ItemList>
  );
};

/** "3 vagas livres · 2 demandas compatíveis": o que as turmas do semestre ainda podem receber. */
const SemesterSummary = ({ disciplines, menu }: { disciplines: DisciplineWithUsage[]; menu: Demand[] }) => {
  const current = disciplines.filter((discipline) => discipline.isCurrent);
  if (current.length === 0) return null;
  const slots = current.reduce((sum, discipline) => sum + freeSlots(discipline), 0);
  // Uma demanda que combina com duas turmas conta uma vez só.
  const demands = new Set(current.flatMap((discipline) => matchingDemands(menu, discipline).map(({ demand }) => demand.id)));

  return (
    <span className="tabular-nums">
      {pluralize(slots, 'vaga livre', 'vagas livres')} · {pluralize(demands.size, 'demanda compatível', 'demandas compatíveis')}
    </span>
  );
};

export const DisciplinesPage = () => {
  const disciplinesQuery = useDisciplines();
  const { data: menu = [] } = useMenu();
  const { data: projects = [] } = useProjects();
  const [searchParams, setSearchParams] = useSearchParams();
  const creating = searchParams.get('nova') === '1';
  const tab: SemesterTab = searchParams.get('semestre') === 'anteriores' ? 'anteriores' : 'atual';

  const updateParams = (changes: Record<string, string | null>) =>
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current);
        for (const [key, value] of Object.entries(changes)) {
          if (value === null) params.delete(key);
          else params.set(key, value);
        }
        return params;
      },
      { replace: true },
    );
  const setCreating = (open: boolean) => updateParams({ nova: open ? '1' : null });

  const disciplines = disciplinesQuery.data ?? [];
  const currentSemester = disciplines.find((discipline) => discipline.isCurrent)?.semester ?? 'Este semestre';

  return (
    <Page
      title="Disciplinas"
      subtitle="Suas turmas e as demandas que combinam com cada uma."
      meta={<SemesterSummary disciplines={disciplines} menu={menu} />}
      actions={
        <Button variant="primary" onClick={() => setCreating(true)}>
          <PlusIcon size={15} />
          Nova disciplina
        </Button>
      }
    >
      <UnderlineTabs
        label="Semestre"
        value={tab}
        onChange={(value) => updateParams({ semestre: value === 'anteriores' ? 'anteriores' : null })}
        options={[
          { value: 'atual', label: currentSemester },
          { value: 'anteriores', label: 'Semestres anteriores' },
        ]}
      />
      <QueryView query={disciplinesQuery}>
        {(loaded) => <DisciplineList disciplines={loaded} menu={menu} projects={projects} tab={tab} onCreate={() => setCreating(true)} />}
      </QueryView>
      {creating && <NewDisciplineModal onClose={() => setCreating(false)} />}
    </Page>
  );
};
