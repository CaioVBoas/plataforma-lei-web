import { useId } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { CoverageMeter } from '@/components/ui/coverageMeter';
import { TrayIcon } from '@/components/ui/icons';
import { AnchorIcon, Item, ItemList } from '@/components/ui/itemList';
import { FactGrid, Page } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import { UnderlineTabs } from '@/components/ui/underlineTabs';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useMenu } from '@/features/demands/useDemands';
import { ProjectRow } from '@/features/projects/shared/components/projectRow';
import { useProjects } from '@/features/projects/shared/hooks/useProjects';
import { useTabParam } from '@/hooks/useTabParam';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { CoTeachers } from './components/coTeachers';
import { DisciplineForm } from './components/disciplineForm';
import { useDiscipline, useRemoveDiscipline, useUpdateDiscipline } from './useDisciplines';
import type { DisciplineWithUsage } from './types';
import { LEVEL_COPY, slotsLabel } from './utils/disciplinePresentation';
import { matchingDemands } from './utils/matchingDemands';

const TABS = ['projetos', 'demandas', 'docentes', 'turma'] as const;

const Empty = ({ children }: { children: string }) => <p className="py-6 text-sm text-ink-3">{children}</p>;

const DisciplineProjects = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const { data: projects = [] } = useProjects();
  const { data: calendar } = useCalendar();
  const own = projects.filter((project) => project.disciplineId === discipline.id);
  if (!calendar) return null;
  if (own.length === 0) return <Empty>Nenhum projeto nesta turma ainda. As demandas que combinam estão na aba ao lado.</Empty>;

  return (
    <ItemList flush>
      {own.map((project) => (
        <ProjectRow key={project.id} project={project} today={calendar.today} />
      ))}
    </ItemList>
  );
};

/** Demandas livres em que a turma cobre metade das competências e que cabem na altura do curso. */
const MatchingDemands = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const { data: menu = [] } = useMenu();
  const matches = matchingDemands(menu, discipline);
  if (matches.length === 0) return <Empty>Nenhuma demanda livre combina agora. Revise as competências na aba Turma se ela trabalha mais coisas.</Empty>;

  return (
    <ItemList flush>
      {matches.map(({ demand, match }) => (
        <Item
          key={demand.id}
          to={paths.demand(demand.id)}
          label={demand.title}
          anchor={
            <AnchorIcon>
              <TrayIcon size={18} />
            </AnchorIcon>
          }
        >
          <p className="truncate text-[15px] font-semibold text-ink">{demand.title}</p>
          <p className="mt-1 truncate text-[13px] text-ink-2">{demand.organization.name}</p>
          <div className="mt-2 flex items-center gap-2.5 text-[13px] text-ink-3">
            <CoverageMeter covered={match.covered.length} total={demand.skills.length} fits={match.fits} />
            Cobre {match.covered.length} de {demand.skills.length} competências
          </div>
        </Item>
      ))}
    </ItemList>
  );
};

const DisciplineSettings = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const formId = useId();
  const toast = useToast();
  const navigate = useNavigate();
  const update = useUpdateDiscipline();
  const remove = useRemoveDiscipline();

  const removeDiscipline = () =>
    remove.mutate(discipline.id, {
      onSuccess: () => {
        toast.show(`${discipline.name} removida.`);
        navigate(paths.disciplines, { replace: true });
      },
      onError: (error) => toast.show(error.message),
    });

  return (
    <div className="pt-6">
      <p className="mb-6 text-sm text-ink-2">Mudar as competências ou a altura do curso muda na hora quais demandas combinam com esta disciplina.</p>
      <DisciplineForm
        key={discipline.id}
        formId={formId}
        defaultValues={discipline}
        onSubmit={(input) => update.mutate({ id: discipline.id, input }, { onSuccess: () => toast.show('Disciplina atualizada.') })}
      />
      {update.isError && (
        <p role="alert" className="mt-4 text-sm text-critical">
          {update.error.message}
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
        {discipline.activeProjects === 0 ? (
          <Button variant="destructive" size="sm" onClick={removeDiscipline}>
            Remover disciplina
          </Button>
        ) : (
          <span />
        )}
        <Button variant="primary" type="submit" form={formId} disabled={update.isPending}>
          Salvar alterações
        </Button>
      </div>
    </div>
  );
};

const DisciplineView = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const [tab, setTab] = useTabParam(TABS);
  const { data: menu = [] } = useMenu();
  const { data: projects = [] } = useProjects();
  const projectCount = projects.filter((project) => project.disciplineId === discipline.id).length;
  // Turma de semestre passado não recebe demanda nem tem formulário (regra 4): as abas somem.
  const tabs = discipline.isCurrent ? TABS : (['projetos', 'docentes'] as const);
  const active = tabs.includes(tab as never) ? tab : 'projetos';

  return (
    <Page
      title={discipline.name}
      back={{ to: paths.disciplines, label: 'Disciplinas' }}
      subtitle={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Tag tone={discipline.isCurrent ? 'positive' : 'neutral'}>{discipline.isCurrent ? 'Recebendo demandas' : 'Semestre encerrado'}</Tag>
          <span>{[discipline.semester, discipline.code].filter(Boolean).join(' · ')}</span>
        </span>
      }
    >
      <FactGrid
        items={[
          { label: 'Estudantes', value: `${discipline.students} em equipes de ${discipline.teamSize}` },
          { label: 'Altura do curso', value: `${LEVEL_COPY[discipline.level].label}, ${LEVEL_COPY[discipline.level].periods}` },
          { label: 'Vagas de projeto', value: discipline.isCurrent ? `${slotsLabel(discipline)} de ${discipline.projectSlots}` : pluralize(projectCount, 'projeto', 'projetos') },
          { label: 'Competências', value: pluralize(discipline.skills.length, 'competência', 'competências') },
        ]}
      />

      <UnderlineTabs
        label="Sobre a disciplina"
        value={active}
        onChange={setTab}
        className="mt-10"
        options={[
          { value: 'projetos', label: 'Projetos', count: projectCount },
          ...(discipline.isCurrent ? [{ value: 'demandas' as const, label: 'Demandas que combinam', count: matchingDemands(menu, discipline).length }] : []),
          { value: 'docentes', label: 'Docentes', count: discipline.coTeachers.length + 1 },
          ...(discipline.isCurrent ? [{ value: 'turma' as const, label: 'Turma' }] : []),
        ]}
      />

      {active === 'projetos' && <DisciplineProjects discipline={discipline} />}
      {active === 'demandas' && <MatchingDemands discipline={discipline} />}
      {active === 'docentes' && (
        <div className="pt-6">
          <CoTeachers discipline={discipline} />
        </div>
      )}
      {active === 'turma' && <DisciplineSettings discipline={discipline} />}
    </Page>
  );
};

export const DisciplinePage = () => {
  const { disciplineId = '' } = useParams();
  const disciplineQuery = useDiscipline(disciplineId);
  return <QueryView query={disciplineQuery}>{(discipline) => <DisciplineView discipline={discipline} />}</QueryView>;
};
