import { Link } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/query-states';
import { buttonClassName } from '@/components/ui/button-styles';
import { EmptyState } from '@/components/ui/empty-state';
import { GroupedList, ListRow } from '@/components/ui/grouped-list';
import { CloseIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { formatShortDate, isLinkWindowOpen, semesterWeek } from '@/domain/calendar';
import { freeSlots } from '@/domain/discipline-rules';
import { rankDisciplines } from '@/domain/matching';
import type { Account, Demand, SemesterCalendar } from '@/domain/types';
import { useAccount, useUpdateAccount } from '@/features/account/hooks/use-account';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { DemandRow } from '@/features/demands/components/demand-row';
import { useOpenDemands } from '@/features/demands/hooks/use-demands';
import { useCurrentDisciplines } from '@/features/disciplines/hooks/use-disciplines';
import type { DisciplineWithUsage } from '@/features/disciplines/types';
import { useAgenda } from '@/features/projects/hooks/use-agenda';
import type { AgendaItem } from '@/features/projects/utils/agenda';
import { MILESTONE_COPY, milestoneDateLine } from '@/features/projects/utils/project-presentation';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';

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

const NextSteps = ({ agenda, today }: { agenda: AgendaItem[]; today: string }) => {
  if (agenda.length === 0) {
    return (
      <EmptyState
        title="Nada pendente"
        description="Nenhum projeto em curso agora. Escolha uma demanda para uma das suas turmas."
        action={
          <Link to={paths.demands} className={buttonClassName({ variant: 'primary' })}>
            Ver demandas
          </Link>
        }
      />
    );
  }

  return (
    <GroupedList>
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
    .map((demand) => ({ demand, best: rankDisciplines(demand, disciplines)[0] }))
    .filter(({ best }) => best?.fits && freeSlots(best.discipline) > 0)
    .slice(0, SUGGESTIONS_ON_HOME);

  if (fitting.length === 0) {
    return <p className="text-sm text-ink-2">Nenhuma demanda aberta combina com uma turma com vaga agora.</p>;
  }

  return (
    <GroupedList>
      {fitting.map(({ demand, best }) => (
        <DemandRow key={demand.id} demand={demand} best={best} today={today} />
      ))}
    </GroupedList>
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
  const { data: demands } = useOpenDemands();
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
          <Section title="Próximos passos" description="A próxima etapa de cada projeto em curso, do prazo mais curto ao mais longo.">
            <NextSteps agenda={agenda} today={calendar.today} />
          </Section>

          {isLinkWindowOpen(calendar) && (
            <Section
              title="Demandas para suas turmas"
              aside={
                <Link to={paths.demands} className={buttonClassName({ variant: 'plain', size: 'sm' })}>
                  Ver todas
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
