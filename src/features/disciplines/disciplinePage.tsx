import { useId } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { TrayIcon } from '@/components/ui/icons';
import { AnchorIcon, Item, ItemList } from '@/components/ui/itemList';
import { Page, Section } from '@/components/ui/page';
import { Tag } from '@/components/ui/tag';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useMenu } from '@/features/demands/useDemands';
import { ProjectRow } from '@/features/projects/shared/components/projectRow';
import { useProjects } from '@/features/projects/shared/hooks/useProjects';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { paths } from '@/routes/paths';
import { CoTeachers } from './components/coTeachers';
import { DisciplineForm } from './components/disciplineForm';
import { useDiscipline, useRemoveDiscipline, useUpdateDiscipline } from './useDisciplines';
import type { DisciplineWithUsage } from './types';
import { disciplineMeta, LEVEL_COPY, slotsLabel } from './utils/disciplinePresentation';
import { matchingDemands } from './utils/matchingDemands';

const DisciplineProjects = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const { data: projects = [] } = useProjects();
  const { data: calendar } = useCalendar();
  const own = projects.filter((project) => project.disciplineId === discipline.id);
  if (own.length === 0 || !calendar) return null;

  return (
    <Section title="Projetos" description={discipline.isCurrent ? slotsLabel(discipline) : undefined}>
      <ItemList>
        {own.map((project) => (
          <ProjectRow key={project.id} project={project} today={calendar.today} />
        ))}
      </ItemList>
    </Section>
  );
};

/** Só faz sentido para a turma atual: as antigas não recebem demandas (regra 4). */
const MatchingDemands = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const { data: menu = [] } = useMenu();
  if (!discipline.isCurrent) return null;
  const matches = matchingDemands(menu, discipline);

  return (
    <Section id="demandas" title="Demandas que combinam" description="Demandas livres no cardápio em que a turma cobre pelo menos metade das competências pedidas.">
      {matches.length > 0 ? (
        <ItemList>
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
              <Tag tone="positive" className="mt-2">
                Cobre {match.covered.length} de {demand.skills.length} competências
              </Tag>
            </Item>
          ))}
        </ItemList>
      ) : (
        <p className="text-sm text-ink-2">Nenhuma demanda livre no cardápio combina agora. Revise as competências acima se a turma trabalha mais coisas.</p>
      )}
    </Section>
  );
};

const DisciplineView = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const formId = useId();
  const toast = useToast();
  const navigate = useNavigate();
  const update = useUpdateDiscipline();
  const remove = useRemoveDiscipline();
  const hasProjects = discipline.activeProjects > 0;
  useScrollToHash();

  const removeDiscipline = () =>
    remove.mutate(discipline.id, {
      onSuccess: () => {
        toast.show(`${discipline.name} removida.`);
        navigate(paths.disciplines, { replace: true });
      },
      onError: (error) => toast.show(error.message),
    });

  return (
    <Page
      title={discipline.name}
      back={{ to: paths.disciplines, label: 'Disciplinas' }}
      subtitle={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Tag tone={discipline.isCurrent ? 'positive' : 'neutral'}>{discipline.isCurrent ? 'Recebendo demandas' : 'Semestre encerrado'}</Tag>
          <span>
            {discipline.semester} · {disciplineMeta(discipline)} · {LEVEL_COPY[discipline.level].label.toLowerCase()}
          </span>
        </span>
      }
    >
      <DisciplineProjects discipline={discipline} />
      <Section title="Docentes" description="Quem divide a disciplina vê e edita os mesmos projetos.">
        <CoTeachers discipline={discipline} />
      </Section>
      <MatchingDemands discipline={discipline} />

      {discipline.isCurrent && (
        <Section id="turma" title="Turma" description="Mudar as competências muda na hora quais demandas combinam com esta disciplina.">
          <div className="rounded-lg border border-line p-5 sm:p-6">
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
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              {!hasProjects ? (
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
        </Section>
      )}
    </Page>
  );
};

export const DisciplinePage = () => {
  const { disciplineId = '' } = useParams();
  const disciplineQuery = useDiscipline(disciplineId);
  return <QueryView query={disciplineQuery}>{(discipline) => <DisciplineView discipline={discipline} />}</QueryView>;
};
