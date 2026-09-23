import { useId } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/query-states';
import { useToast } from '@/components/feedback/toast-context';
import { Button } from '@/components/ui/button';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { Page, Section } from '@/components/ui/page';
import { StatusLabel } from '@/components/ui/status-label';
import { matchDiscipline } from '@/domain/matching';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { useMenu } from '@/features/demands/hooks/use-demands';
import { ProjectRow } from '@/features/projects/components/project-row';
import { useProjects } from '@/features/projects/hooks/use-projects';
import { paths } from '@/routes/paths';
import { DisciplineForm } from '../components/discipline-form';
import { useDiscipline, useRemoveDiscipline, useUpdateDiscipline } from '../hooks/use-disciplines';
import type { DisciplineWithUsage } from '../types';
import { disciplineMeta, slotsLabel } from '../utils/discipline-presentation';

const DisciplineProjects = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const { data: projects = [] } = useProjects();
  const { data: calendar } = useCalendar();
  const own = projects.filter((project) => project.disciplineId === discipline.id);
  if (own.length === 0 || !calendar) return null;

  return (
    <Section title="Projetos" description={discipline.isCurrent ? slotsLabel(discipline) : undefined}>
      <GroupedList>
        {own.map((project) => (
          <ProjectRow key={project.id} project={project} today={calendar.today} />
        ))}
      </GroupedList>
    </Section>
  );
};

/** Só faz sentido para a turma atual: as antigas não recebem demandas (regra 4). */
const MatchingDemands = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const { data: menu = [] } = useMenu();
  // Reservada por colega não está disponível para esta turma.
  const demands = menu.filter((demand) => demand.status === 'open' || demand.reservation?.mine);
  if (!discipline.isCurrent) return null;
  const matches = demands.map((demand) => ({ demand, match: matchDiscipline(demand, discipline) })).filter(({ match }) => match.fits);

  return (
    <Section title="Demandas que combinam" description="Demandas livres no cardápio em que a turma cobre pelo menos metade das competências pedidas.">
      {matches.length > 0 ? (
        <GroupedList>
          {matches.map(({ demand, match }) => (
            <ListRow key={demand.id} to={paths.demand(demand.id)}>
              <p className="text-[13px] text-ink-3">{demand.organization.name}</p>
              <p className="mt-0.5 text-[15px] font-medium text-ink">{demand.title}</p>
              <p className="mt-1 text-[13px] text-ink-2">
                Cobre {match.covered.length} de {demand.skills.length} competências
              </p>
            </ListRow>
          ))}
        </GroupedList>
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
          {discipline.isCurrent ? <StatusLabel tone="positive">Recebendo demandas</StatusLabel> : <StatusLabel tone="neutral">Semestre encerrado</StatusLabel>}
          <span>
            {discipline.semester} · {disciplineMeta(discipline)}
          </span>
        </span>
      }
    >
      <DisciplineProjects discipline={discipline} />
      <MatchingDemands discipline={discipline} />

      {discipline.isCurrent && (
        <Section title="Turma" description="Mudar as competências muda na hora quais demandas combinam com esta disciplina.">
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
