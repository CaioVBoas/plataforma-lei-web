import { useId } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QueryView } from '@/components/feedback/queryStates';
import { useToast } from '@/components/feedback/toastContext';
import { Button } from '@/components/ui/button';
import { cardGridClassName } from '@/components/ui/card';
import { CheckIcon } from '@/components/ui/icons';
import { ItemList } from '@/components/ui/itemList';
import { FactGrid, Page, Section } from '@/components/ui/page';
import { ProfileHeader } from '@/components/ui/profileHeader';
import { Tag } from '@/components/ui/tag';
import { useCalendar } from '@/features/calendar/useCalendar';
import { DemandCard } from '@/features/demands/components/demandCard';
import { useMenu } from '@/features/demands/useDemands';
import { ProjectRow } from '@/features/projects/shared/components/projectRow';
import { useProjects } from '@/features/projects/shared/hooks/useProjects';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { paths } from '@/routes/paths';
import { pluralize } from '@/utils/format';
import { CoTeachers } from './components/coTeachers';
import { DisciplineForm } from './components/disciplineForm';
import { useDiscipline, useRemoveDiscipline, useUpdateDiscipline } from './useDisciplines';
import type { DisciplineWithUsage } from './types';
import { LEVEL_COPY, slotsLabel } from './utils/disciplinePresentation';
import { matchingDemands } from './utils/matchingDemands';

const Empty = ({ children }: { children: string }) => <p className="text-sm text-ink-3">{children}</p>;

const DisciplineProjects = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const { data: projects = [] } = useProjects();
  const { data: calendar } = useCalendar();
  const own = projects.filter((project) => project.disciplineId === discipline.id);
  if (!calendar) return null;
  if (own.length === 0) return <Empty>Nenhum projeto nesta turma ainda. Veja as demandas que combinam logo abaixo.</Empty>;

  return (
    <ItemList>
      {own.map((project) => (
        <ProjectRow key={project.id} project={project} today={calendar.today} />
      ))}
    </ItemList>
  );
};

/** Demandas livres em que a turma cobre metade das competências e que cabem na altura do curso, como no cardápio. */
const MatchingDemands = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const { data: menu = [] } = useMenu();
  const { data: calendar } = useCalendar();
  const matches = matchingDemands(menu, discipline);
  if (!calendar) return null;
  if (matches.length === 0) return <Empty>Nenhuma demanda livre combina agora. Revise as competências da turma, logo abaixo, se ela trabalha mais coisas.</Empty>;

  return (
    <ul className={cardGridClassName}>
      {matches.map(({ demand, match }) => (
        <li key={demand.id}>
          <DemandCard demand={demand} best={match} today={calendar.today} />
        </li>
      ))}
    </ul>
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
    <div className="overflow-hidden rounded-lg border border-line">
      <div className="p-5 sm:p-6">
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
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas px-5 py-3.5 sm:px-6">
        {discipline.activeProjects === 0 ? (
          <Button variant="destructive" size="sm" onClick={removeDiscipline}>
            Remover disciplina
          </Button>
        ) : (
          <span className="text-[13px] text-ink-3">Com projeto em curso, a disciplina não pode ser removida.</span>
        )}
        <Button variant="primary" type="submit" form={formId} disabled={update.isPending}>
          <CheckIcon size={15} />
          Salvar alterações
        </Button>
      </div>
    </div>
  );
};

/**
 * A disciplina em uma página: o resumo da turma na capa e, em seguida, os
 * projetos, as demandas que combinam, quem divide a turma e o formulário.
 */
const DisciplineView = ({ discipline }: { discipline: DisciplineWithUsage }) => {
  const { data: projects = [] } = useProjects();
  const projectCount = projects.filter((project) => project.disciplineId === discipline.id).length;
  useScrollToHash();

  return (
    <Page
      title={discipline.name}
      back={{ to: paths.disciplines, label: 'Disciplinas' }}
      hero={
        <ProfileHeader
          avatar={
            <span className="flex size-[72px] items-center justify-center rounded-lg bg-monogram text-[13px] font-bold text-monogram-ink tabular-nums">
              {discipline.code || discipline.name.charAt(0)}
            </span>
          }
          eyebrow={`Semestre ${discipline.semester}`}
          title={discipline.name}
          meta={
            <Tag tone={discipline.isCurrent ? 'positive' : 'neutral'}>{discipline.isCurrent ? 'Recebendo demandas' : 'Semestre encerrado'}</Tag>
          }
        />
      }
    >
      <FactGrid
        columns={3}
        items={[
          { label: 'Estudantes', value: `${discipline.students} em equipes de ${discipline.teamSize}` },
          { label: 'Altura do curso', value: `${LEVEL_COPY[discipline.level].label}, ${LEVEL_COPY[discipline.level].periods}` },
          { label: 'Vagas de projeto', value: discipline.isCurrent ? `${slotsLabel(discipline)} de ${discipline.projectSlots}` : pluralize(projectCount, 'projeto', 'projetos') },
        ]}
      />
      <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Competências da turma">
        {discipline.skills.map((skill) => (
          <Tag key={skill}>{skill}</Tag>
        ))}
      </div>

      <Section id="projetos" title="Projetos" description={pluralize(projectCount, 'projeto nesta turma', 'projetos nesta turma')} compact>
        <DisciplineProjects discipline={discipline} />
      </Section>

      {discipline.isCurrent && (
        <Section id="demandas" title="Demandas que combinam" description="Livres no cardápio, cobrem metade das competências e cabem na altura do curso." compact>
          <MatchingDemands discipline={discipline} />
        </Section>
      )}

      <Section id="docentes" title="Docentes" description="Quem divide a disciplina vê e edita os mesmos projetos." compact>
        <CoTeachers discipline={discipline} />
      </Section>

      {discipline.isCurrent && (
        <Section id="turma" title="Turma" description="Mudar as competências ou a altura do curso muda na hora as demandas que combinam." compact>
          <DisciplineSettings discipline={discipline} />
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
