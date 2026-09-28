import { Link } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { cardGridClassName, linkCardClassName } from '@/components/ui/card';
import { CloseIcon, PlusIcon, TrayIcon } from '@/components/ui/icons';
import type { StatusTone } from '@/components/ui/statusLabel';
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
import { SemesterDates } from './components/semesterDates';
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

interface StepCardProps {
  to: string;
  kind: string;
  tone: StatusTone;
  title: string;
  context: string;
  when?: string;
  overdue?: boolean;
}

/**
 * Cada próximo passo é um card: o tipo de passo em tag, a ação em destaque e
 * de onde ela vem. Em grade, o docente vê o dia inteiro sem ler linha a linha.
 */
const StepCard = ({ to, kind, tone, title, context, when, overdue }: StepCardProps) => (
  <Link to={to} className={linkCardClassName}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Tag tone={tone}>{kind}</Tag>
      {when && <span className={cn('text-[13px]', overdue ? 'font-medium text-caution' : 'text-ink-3')}>{when}</span>}
    </div>
    <p className="mt-3 text-headline group-hover:text-accent">{title}</p>
    <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-2">{context}</p>
  </Link>
);

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
    <ul className={cardGridClassName}>
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

interface HeroProps {
  firstName: string;
  line: string;
  stats: { value: number; label: string }[];
}

/**
 * Boas-vindas em petróleo: o único bloco de cor cheia do portal, para o Início
 * ter cara de ponto de partida. Os números são o semestre do docente em um olhar.
 */
const HomeHero = ({ firstName, line, stats }: HeroProps) => (
  <section className="relative overflow-hidden rounded-lg bg-brand px-6 py-7 text-white sm:px-8 sm:py-8">
    <span aria-hidden="true" className="absolute -top-16 -right-16 size-56 rounded-full bg-brand-500" />
    <div className="relative flex flex-wrap items-end justify-between gap-6">
      <div className="min-w-0 flex-[1_1_360px]">
        <h1 className="text-[32px] leading-tight font-bold tracking-[-0.021em]">Olá, {firstName}</h1>
        <p className="mt-2 max-w-[58ch] text-[15px] leading-relaxed text-brand-100">{line}</p>
      </div>
      <dl className="flex flex-wrap gap-2.5">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-[104px] rounded-md bg-brand-700 px-4 py-3">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-[24px] leading-none font-bold tabular-nums">{stat.value}</dd>
            <dd className="mt-1.5 text-[12px] text-brand-100">{stat.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

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

  const reservations = demands.filter(isMyReservation);
  const running = agenda.length;
  const freeSlotsTotal = disciplines.reduce((total, discipline) => total + freeSlots(discipline), 0);

  return (
    <Page
      title={`Olá, ${firstName}`}
      hero={
        <HomeHero
          firstName={firstName}
          line={semesterLine(calendar, disciplines)}
          stats={[
            { value: running, label: running === 1 ? 'projeto em curso' : 'projetos em curso' },
            { value: reservations.length, label: reservations.length === 1 ? 'reserva' : 'reservas' },
            { value: freeSlotsTotal, label: freeSlotsTotal === 1 ? 'vaga livre' : 'vagas livres' },
          ]}
        />
      }
    >
      {!account.tutorialSeen && <TutorialInvite />}

      <Section title="Calendário do semestre" description="As datas que valem para todas as suas turmas.">
        <SemesterDates calendar={calendar} />
      </Section>

      {disciplines.length === 0 ? (
        <Section title="Comece pelas suas turmas">
          <EmptyState
            title="Cadastre as disciplinas deste semestre"
            description="É o que a turma trabalha que decide quais demandas combinam com ela. Leva um minuto."
            action={
              <Link to={paths.newDiscipline} className={buttonClassName({ variant: 'primary' })}>
                <PlusIcon size={15} />
                Cadastrar disciplina
              </Link>
            }
          />
        </Section>
      ) : (
        <>
          <Section title="Próximos passos" description="Indicações, reservas e a próxima etapa de cada projeto em curso.">
            <NextSteps
              agenda={agenda}
              reservations={reservations}
              invitations={demands.filter((demand) => demand.invitation && demand.status === 'open')}
              today={calendar.today}
            />
          </Section>

          {isLinkWindowOpen(calendar) && (
            <Section
              title="No cardápio para suas turmas"
              aside={
                <Link to={paths.menu} className={buttonClassName({ variant: 'secondary', size: 'sm' })}>
                  <TrayIcon size={15} />
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
