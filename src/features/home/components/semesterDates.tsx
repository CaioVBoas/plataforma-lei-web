import { daysBetween, formatRelativeDays, formatShortDate, semesterWeek } from '@/domain/calendar';
import type { IsoDate, SemesterCalendar as Calendar } from '@/domain/types';
import { cn } from '@/utils/cn';

interface Milestone {
  label: string;
  date: IsoDate;
  hint: string;
}

const milestonesOf = (calendar: Calendar): Milestone[] => [
  { label: 'Prazo para levar demandas', date: calendar.linkDeadline, hint: 'Depois dele, nenhuma demanda nova entra nas turmas.' },
  { label: 'Entrega parcial', date: calendar.midtermAt, hint: 'A turma mostra à organização o que já funciona.' },
  { label: 'Entrega final', date: calendar.finalAt, hint: 'A organização recebe o que a turma construiu.' },
  { label: 'Fim do semestre', date: calendar.endsAt, hint: 'Encerrar os projetos e o relatório no SIGAA.' },
];

/**
 * As datas que mandam no semestre, com a de hoje marcada na barra. O próximo
 * marco fica em destaque para o docente saber o que vem primeiro.
 */
export const SemesterDates = ({ calendar }: { calendar: Calendar }) => {
  const week = semesterWeek(calendar);
  const total = Math.max(1, daysBetween(calendar.startsAt, calendar.endsAt));
  const progress = Math.min(100, Math.max(0, (daysBetween(calendar.startsAt, calendar.today) / total) * 100));
  const milestones = milestonesOf(calendar);
  const nextIndex = milestones.findIndex((milestone) => daysBetween(calendar.today, milestone.date) >= 0);

  return (
    <div className="rounded-lg border border-line p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[13px] font-semibold text-brand-strong">
          Semestre {calendar.id} · semana {week.current} de {week.total}
        </p>
        <p className="text-[12px] text-ink-3">
          {formatShortDate(calendar.startsAt)} a {formatShortDate(calendar.endsAt)}
        </p>
      </div>

      <div
        role="progressbar"
        aria-label="Andamento do semestre"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="mt-3 h-2 overflow-hidden rounded-full bg-fill-strong"
      >
        <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
      </div>

      <ol className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {milestones.map((milestone, index) => {
          const passed = daysBetween(calendar.today, milestone.date) < 0;
          const next = index === nextIndex;
          return (
            <li
              key={milestone.label}
              className={cn('rounded-md border px-3.5 py-3', next ? 'border-fact-line bg-fact' : 'border-line', passed && 'opacity-60')}
            >
              <p className={cn('text-[12px] font-semibold', next ? 'text-fact-label' : 'text-ink-2')}>{milestone.label}</p>
              <p className="mt-1 text-[15px] font-semibold text-ink tabular-nums">{formatShortDate(milestone.date)}</p>
              <p className={cn('text-[12px]', next ? 'font-medium text-brand-strong' : 'text-ink-3')}>
                {passed ? 'Já passou' : formatRelativeDays(calendar.today, milestone.date)}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-ink-3">{milestone.hint}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
