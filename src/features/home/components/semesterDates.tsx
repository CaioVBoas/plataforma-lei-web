import { daysBetween, formatRelativeDays, formatShortDate, semesterWeek } from '@/domain/calendar';
import type { IsoDate, SemesterCalendar } from '@/domain/types';
import { cn } from '@/utils/cn';

const milestonesOf = (calendar: SemesterCalendar): { label: string; date: IsoDate }[] => [
  { label: 'Prazo para levar demandas', date: calendar.linkDeadline },
  { label: 'Entrega parcial', date: calendar.midtermAt },
  { label: 'Entrega final', date: calendar.finalAt },
  { label: 'Fim do semestre', date: calendar.endsAt },
];

/** As quatro datas que mandam no semestre, numa linha só, com a semana atual na barra. */
export const SemesterDates = ({ calendar }: { calendar: SemesterCalendar }) => {
  const week = semesterWeek(calendar);
  const total = Math.max(1, daysBetween(calendar.startsAt, calendar.endsAt));
  const progress = Math.min(100, Math.max(0, (daysBetween(calendar.startsAt, calendar.today) / total) * 100));
  const milestones = milestonesOf(calendar);
  const nextIndex = milestones.findIndex((milestone) => daysBetween(calendar.today, milestone.date) >= 0);

  return (
    <div className="rounded-lg border border-line px-5 py-4">
      <div className="flex items-center gap-4">
        <p className="shrink-0 text-[13px] text-ink-2">
          Semana <span className="font-semibold text-ink tabular-nums">{week.current}</span> de {week.total}
        </p>
        <div
          role="progressbar"
          aria-label="Andamento do semestre"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className="h-1 flex-1 overflow-hidden rounded-full bg-fill-strong"
        >
          <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <ol className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
        {milestones.map((milestone, index) => {
          const passed = daysBetween(calendar.today, milestone.date) < 0;
          const next = index === nextIndex;
          return (
            <li key={milestone.label} className={cn('min-w-0', passed && 'opacity-50')}>
              <p className="truncate text-[13px] text-ink-2">{milestone.label}</p>
              <p className="mt-0.5 text-[15px] font-semibold text-ink tabular-nums">
                {formatShortDate(milestone.date)}
                <span className={cn('ml-2 text-[13px] font-normal', next ? 'font-medium text-brand-strong' : 'text-ink-3')}>
                  {passed ? 'passou' : formatRelativeDays(calendar.today, milestone.date)}
                </span>
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
