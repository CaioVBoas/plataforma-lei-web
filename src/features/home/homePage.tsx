import { Link } from 'react-router-dom';
import cinPhoto from '@/assets/portal/inicio/cin.webp';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { MascotInvite } from '@/components/ui/mascotInvite';
import { EmptyState } from '@/components/ui/emptyState';
import { cardGridClassName } from '@/components/ui/card';
import { StepCard } from '@/components/ui/stepCard';
import { TutorialInvite } from '@/components/ui/tutorialInvite';
import { WelcomeHero } from '@/components/ui/welcomeHero';
import { ArrowRightIcon, PlusIcon, TrayIcon } from '@/components/ui/icons';
import { Page } from '@/components/ui/page';
import { formatShortDate, isLinkWindowOpen, semesterWeek } from '@/domain/calendar';
import { freeSlots } from '@/domain/disciplineRules';
import { rankDemandsFor } from '@/domain/matching';
import { isMyReservation } from '@/domain/reservation';
import type { Account, Demand, SemesterCalendar } from '@/domain/types';
import { useAccount, useUpdateAccount } from '@/features/account/useAccount';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useMenu } from '@/features/demands/useDemands';
import { daysLeftLabel } from '@/features/demands/utils/demandPresentation';
import { useCurrentDisciplines } from '@/features/disciplines/useDisciplines';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { useAgenda } from '@/features/projects/shared/hooks/useAgenda';
import type { AgendaItem } from '@/features/projects/shared/utils/agenda';
import { MILESTONE_COPY, milestoneDateLine } from '@/features/projects/shared/utils/projectPresentation';
import { paths } from '@/routes/paths';
import { capitalize, pluralize } from '@/utils/format';

interface NextStepsProps {
  agenda: AgendaItem[];
  reservations: Demand[];
  invitations: Demand[];
  today: string;
}

const NextSteps = ({ agenda, reservations, invitations, today }: NextStepsProps) => {
  if (agenda.length === 0 && reservations.length === 0 && invitations.length === 0) {
    return (
      <EmptyState
        title="Nada pendente"
        description="Nenhum projeto em curso nem reserva aberta. Que tal escolher uma demanda no cardápio?"
        action={
          <Link to={paths.menu} className={buttonClassName({ variant: 'primary' })}>
            <TrayIcon size={16} />
            Abrir o cardápio
          </Link>
        }
      />
    );
  }

  return (
    <ul className={cardGridClassName}>
      {invitations.map((demand) => (
        <li key={demand.id}>
          <StepCard
            to={paths.demand(demand.id)}
            kind={`Indicada por ${demand.invitation?.from.split(',')[0]}`}
            tone="accent"
            title="Avaliar a indicação do L.E.I."
            context={`${demand.title} · ${demand.organization.name}`}
          />
        </li>
      ))}
      {reservations.map((demand) => (
        <li key={demand.id}>
          <StepCard
            to={paths.demand(demand.id)}
            kind={capitalize(daysLeftLabel(demand.reservation?.until ?? today, today))}
            tone="reserve"
            title="Decidir a reserva"
            context={`${demand.title} · ${demand.organization.name}`}
          />
        </li>
      ))}
      {agenda.map(({ project, milestone, overdue }) => (
        <li key={project.id}>
          <StepCard
            to={paths.project(project.id, milestone.id === 'plan' ? 'plano' : undefined)}
            kind="Etapa do projeto"
            tone={overdue ? 'caution' : 'neutral'}
            title={MILESTONE_COPY[milestone.id].title}
            context={`${project.title} · ${project.organization.name}`}
            when={milestoneDateLine(milestone, today, true)}
            overdue={overdue}
          />
        </li>
      ))}
    </ul>
  );
};

/** Quantas demandas livres ou reservadas por você combinam com alguma turma: é o que o Match Maker vai mostrar. */
const fittingCount = (demands: Demand[], disciplines: DisciplineWithUsage[]) =>
  new Set(disciplines.flatMap((discipline) => rankDemandsFor(demands, discipline).filter(({ match }) => match.fits).map(({ demand }) => demand.id))).size;

const inviteText = (count: number) =>
  count === 0
    ? 'Escolha uma turma e o Match Maker mostra o que combina com ela, inclusive o que combina em parte.'
    : `${pluralize(count, 'demanda combina', 'demandas combinam')} com o que suas turmas trabalham. Escolha uma turma e veja quais.`;

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
  const update = useUpdateAccount();

  if (!agenda || !disciplines || !demands) {
    return (
      <Page title={`Olá, ${firstName}`}>
        <LoadingState />
      </Page>
    );
  }

  const reservations = demands.filter(isMyReservation);
  const running = agenda.length;
  const freeSlotsTotal = disciplines.reduce((total, discipline) => total + freeSlots(discipline), 0);

  return (
    <Page
      title={`Olá, ${firstName}`}
      hero={
        <WelcomeHero
          photo={cinPhoto}
          title={`Olá, ${firstName}`}
          line={semesterLine(calendar, disciplines)}
          stats={[
            { value: running, label: running === 1 ? 'projeto em curso' : 'projetos em curso' },
            { value: reservations.length, label: reservations.length === 1 ? 'reserva' : 'reservas' },
            { value: freeSlotsTotal, label: freeSlotsTotal === 1 ? 'vaga livre' : 'vagas livres' },
          ]}
        />
      }
    >
      {disciplines.length > 0 && isLinkWindowOpen(calendar) && (
        <MascotInvite
          title="Vamos achar o projeto da sua turma?"
          text={inviteText(fittingCount(demands, disciplines))}
          action={
            <Link to={paths.matchMaker()} className={buttonClassName({ variant: 'primary', size: 'lg' })}>
              Abrir o Match Maker
              <ArrowRightIcon size={20} />
            </Link>
          }
        />
      )}

      {!account.tutorialSeen && (
        <TutorialInvite
          to={paths.guide}
          text="Em dois minutos você entende como uma demanda vira projeto da sua turma."
          onDismiss={() => update.mutate({ tutorialSeen: true })}
        />
      )}

      {disciplines.length === 0 ? (
        <EmptyState
          title="Cadastre as disciplinas deste semestre"
          description="É o que a turma trabalha que decide quais demandas combinam com ela. Leva um minuto."
          action={
            <Link to={paths.newDiscipline} className={buttonClassName({ variant: 'primary' })}>
              <PlusIcon size={16} />
              Cadastrar disciplina
            </Link>
          }
        />
      ) : (
        <NextSteps
          agenda={agenda}
          reservations={reservations}
          invitations={demands.filter((demand) => demand.invitation && demand.status === 'open')}
          today={calendar.today}
        />
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
