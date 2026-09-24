import { Link } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { GroupedList, ListRow } from '@/components/ui/groupedList';
import { CloseIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { formatShortDate, isLinkWindowOpen, semesterWeek } from '@/domain/calendar';
import { freeSlots } from '@/domain/disciplineRules';
import { rankDisciplines } from '@/domain/matching';
import { isMyReservation } from '@/domain/reservation';
import type { Account, Demand, SemesterCalendar } from '@/domain/types';
import { useAccount, useUpdateAccount } from '@/features/account/useAccount';
import { useCalendar } from '@/features/calendar/useCalendar';
import { DemandCard } from '@/features/demands/components/demandCard';
import { useMenu } from '@/features/demands/useDemands';
import { daysLeftLabel } from '@/features/demands/utils/demandPresentation';
import { useCurrentDisciplines } from '@/features/disciplines/useDisciplines';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { useAgenda } from '@/features/projects/shared/hooks/useAgenda';
import type { AgendaItem } from '@/features/projects/shared/utils/agenda';
import { MILESTONE_COPY, milestoneDateLine } from '@/features/projects/shared/utils/projectPresentation';
import { Tag } from '@/components/ui/tag';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { capitalize, pluralize } from '@/utils/format';

const SUGGESTIONS_ON_HOME = 3;

const TutorialInvite = () => {
  const update = useUpdateAccount();
  return (
    <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg bg-accent-soft px-5 py-4">
      <div className="min-w-0 flex-[1_1_320px]">
        <p className="text-[15px] font-medium text-ink">Primeira vez por aqui?</p>
        <p className="mt-0.5 text-sm text-ink-2">Em dois minutos você entende como uma demanda vira projeto da sua turma.</p>
      </div>
      <div className="flex items-center gap-1">
        <Link to={paths.guide} className={buttonClassName({ variant: 'primary', size: 'sm' })}>
          Ver como funciona
        </Link>
        <button
          type="button"
          aria-label="Dispensar convite"
          onClick={() => update.mutate({ tutorialSeen: true })}
          className="flex size-8 items-center justify-center rounded-md text-ink-2 hover:bg-surface/60"
        >
          <CloseIcon size={14} />
        </button>
      </div>
    </div>
  );
};

/** Reserva ativa também é um próximo passo: decidir antes que ela expire. */
const ReservationStep = ({ demand, today }: { demand: Demand; today: string }) => {
  const until = demand.reservation?.until ?? today;
  return (
    <ListRow
      to={paths.demand(demand.id)}
      leading={<span className="block size-2.5 rounded-full bg-reserve-dot" />}
      trailing={<Tag tone="reserve">{capitalize(daysLeftLabel(until, today))}</Tag>}
    >
      <p className="text-[15px] font-medium text-ink">Decidir a reserva</p>
      <p className="mt-0.5 truncate text-[13px] text-ink-3">
        {demand.title} · {demand.organization.name}
      </p>
    </ListRow>
  );
};

const NextSteps = ({ agenda, reservations, today }: { agenda: AgendaItem[]; reservations: Demand[]; today: string }) => {
  if (agenda.length === 0 && reservations.length === 0) {
    return (
      <EmptyState
        title="Nada pendente"
        description="Nenhum projeto em curso nem reserva aberta. Que tal escolher uma demanda no cardápio?"
        action={
          <Link to={paths.menu} className={buttonClassName({ variant: 'primary' })}>
            Abrir o cardápio
          </Link>
        }
      />
    );
  }

  return (
    <GroupedList>
      {reservations.map((demand) => (
        <ReservationStep key={demand.id} demand={demand} today={today} />
      ))}
      {agenda.map(({ project, milestone, overdue }) => (
        <ListRow
          key={project.id}
          to={paths.project(project.id, milestone.id === 'plan' ? 'plano' : undefined)}
          leading={<span className={cn('block size-2.5 rounded-full', overdue ? 'bg-caution' : 'bg-accent')} />}
          trailing={<span className={cn('text-[13px]', overdue ? 'font-medium text-caution' : 'text-ink-2')}>{milestoneDateLine(milestone, today, true)}</span>}
        >
          <p className="text-[15px] font-medium text-ink">{MILESTONE_COPY[milestone.id].title}</p>
          <p className="mt-0.5 truncate text-[13px] text-ink-3">
            {project.title} · {project.organization.name}
          </p>
        </ListRow>
      ))}
    </GroupedList>
  );
};

const Suggestions = ({ demands, disciplines, today }: { demands: Demand[]; disciplines: DisciplineWithUsage[]; today: string }) => {
  const fitting = demands
    .filter((demand) => demand.status === 'open')
    .map((demand) => ({ demand, best: rankDisciplines(demand, disciplines)[0] }))
    .filter(({ best }) => best?.fits && freeSlots(best.discipline) > 0)
    .slice(0, SUGGESTIONS_ON_HOME);

  if (fitting.length === 0) {
    return <p className="text-sm text-ink-2">Nenhuma demanda aberta combina com uma turma com vaga agora.</p>;
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {fitting.map(({ demand, best }) => (
        <li key={demand.id}>
          <DemandCard demand={demand} best={best} today={today} />
        </li>
      ))}
    </ul>
  );
};

const semesterLine = (calendar: SemesterCalendar, disciplines: DisciplineWithUsage[]) => {
  const week = semesterWeek(calendar);
  const slots = disciplines.reduce((total, discipline) => total + freeSlots(discipline), 0);
  const base = `Semana ${week.current} de ${week.total} do semestre ${calendar.id}.`;
  if (!isLinkWindowOpen(calendar)) return base;
  if (disciplines.length === 0) return `${base} Cadastre suas turmas para começar.`;
  return `${base} Suas turmas têm ${pluralize(slots, 'vaga', 'vagas')} para projetos até ${formatShortDate(calendar.linkDeadline)}.`;
};

const HomeContent = ({ account, calendar }: { account: Account; calendar: SemesterCalendar }) => {
  const { agenda } = useAgenda();
  const { data: disciplines } = useCurrentDisciplines();
  const { data: demands } = useMenu();
  const firstName = account.name.split(' ')[0];

  if (!agenda || !disciplines || !demands) {
    return (
      <Page title={`Olá, ${firstName}`}>
        <LoadingState />
      </Page>
    );
  }

  return (
    <Page title={`Olá, ${firstName}`} subtitle={semesterLine(calendar, disciplines)}>
      {!account.tutorialSeen && <TutorialInvite />}

      {disciplines.length === 0 ? (
        <Section title="Comece pelas suas turmas">
          <EmptyState
            title="Cadastre as disciplinas deste semestre"
            description="É o que a turma trabalha que decide quais demandas combinam com ela. Leva um minuto."
            action={
              <Link to={paths.newDiscipline} className={buttonClassName({ variant: 'primary' })}>
                Cadastrar disciplina
              </Link>
            }
          />
        </Section>
      ) : (
        <>
          <Section title="Próximos passos" description="Suas reservas e a próxima etapa de cada projeto em curso.">
            <NextSteps agenda={agenda} reservations={demands.filter(isMyReservation)} today={calendar.today} />
          </Section>

          {isLinkWindowOpen(calendar) && (
            <Section
              title="No cardápio para suas turmas"
              aside={
                <Link to={paths.menu} className={buttonClassName({ variant: 'plain', size: 'sm' })}>
                  Abrir o cardápio
                </Link>
              }
            >
              <Suggestions demands={demands} disciplines={disciplines} today={calendar.today} />
            </Section>
          )}
        </>
      )}
    </Page>
  );
};

export const HomePage = () => {
  const { data: account } = useAccount();
  const { data: calendar } = useCalendar();
  if (!account || !calendar) return <LoadingState />;
  return <HomeContent account={account} calendar={calendar} />;
};
