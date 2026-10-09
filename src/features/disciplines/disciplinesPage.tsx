import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { ActionMenu, type ActionMenuItem } from '@/components/ui/actionMenu';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirmDialog';
import { textLinkClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { PlusIcon, TrashIcon } from '@/components/ui/icons';
import { aboveRowLink, Item, ItemList } from '@/components/ui/itemList';
import { Page } from '@/components/ui/page';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { freeSlots } from '@/domain/disciplineRules';
import type { Demand, Project } from '@/domain/types';
import { StatTiles } from '@/components/ui/profileHeader';
import { useMenu } from '@/features/demands/useDemands';
import { useProjects } from '@/features/projects/shared/hooks/useProjects';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { joinWithAnd, pluralize } from '@/utils/format';
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
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const actions: ActionMenuItem[] = [];
  // Só turmas do semestre atual têm formulário; as antigas guardam o histórico como está.
  if (discipline.isCurrent) actions.push({ label: 'Editar', onSelect: () => navigate(paths.disciplineEdit(discipline.id)) });
  if (projects === 0) {
    actions.push({
      label: 'Remover',
      destructive: true,
      onSelect: () => setConfirmingRemove(true),
    });
  }

  const matchesText = pluralize(matches, 'demanda compatível', 'demandas compatíveis');

  return (
    <>
    <Item
      to={paths.discipline(discipline.id)}
      label={discipline.name}
      anchor={<span className="pt-1 text-small whitespace-nowrap text-ink-2 tabular-nums">{discipline.code || '–'}</span>}
      menu={<ActionMenu label={`Ações de ${discipline.name}`} items={actions} />}
    >
      <p className="truncate text-h4">{discipline.name}</p>
      <p className="mt-1 truncate text-small text-ink-2">
        {discipline.isCurrent ? disciplineFacts(discipline) : `${discipline.semester} · ${disciplineFacts(discipline)}`}
        {discipline.coTeachers.length > 0 && ` · com ${joinWithAnd(discipline.coTeachers.map((teacher) => teacher.name ?? teacher.email))}`}
      </p>
      <p className="mt-1 truncate text-small text-ink-2">
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
    {confirmingRemove && (
      <ConfirmDialog
        icon={<TrashIcon size={26} />}
        title={`Remover ${discipline.name}?`}
        description="A disciplina sai da sua lista e deixa de receber indicações. Os projetos já encerrados continuam no histórico."
        confirmLabel="Sim, remover"
        confirmIcon={<TrashIcon size={20} />}
        cancelLabel="Não, manter"
        pending={remove.isPending}
        pendingLabel="Removendo"
        onConfirm={() =>
          remove.mutate(discipline.id, {
            onSuccess: () => toast.show(`${discipline.name} removida.`),
            onError: (error) => toast.show(error.message),
            onSettled: () => setConfirmingRemove(false),
          })
        }
        onClose={() => setConfirmingRemove(false)}
      />
    )}
    </>
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
            <PlusIcon size={16} />
            Cadastrar disciplina
          </Button>
        }
      />
    ) : (
      <p className="py-6 text-small text-ink-3">Nenhuma disciplina de semestres anteriores.</p>
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

/** O semestre em números: o que as turmas ainda podem receber. */
const SemesterSummary = ({ disciplines, menu }: { disciplines: DisciplineWithUsage[]; menu: Demand[] }) => {
  const current = disciplines.filter((discipline) => discipline.isCurrent);
  if (current.length === 0) return null;
  const slots = current.reduce((sum, discipline) => sum + freeSlots(discipline), 0);
  const running = current.reduce((sum, discipline) => sum + discipline.activeProjects, 0);
  // Uma demanda que combina com duas turmas conta uma vez só.
  const demands = new Set(current.flatMap((discipline) => matchingDemands(menu, discipline).map(({ demand }) => demand.id)));

  return (
    <div className="mb-8">
      <StatTiles
        items={[
          { value: current.length, label: current.length === 1 ? 'disciplina ativa' : 'disciplinas ativas' },
          { value: running, label: running === 1 ? 'projeto em curso' : 'projetos em curso' },
          { value: slots, label: slots === 1 ? 'vaga livre' : 'vagas livres' },
          { value: demands.size, label: demands.size === 1 ? 'demanda compatível' : 'demandas compatíveis' },
        ]}
      />
    </div>
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
      actions={
        <Button variant="primary" onClick={() => setCreating(true)}>
          <PlusIcon size={16} />
          Nova disciplina
        </Button>
      }
    >
      <SemesterSummary disciplines={disciplines} menu={menu} />
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
