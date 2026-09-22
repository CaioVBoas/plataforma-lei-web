import type { SemesterCalendar } from '@/domain/types';

/**
 * Calendário acadêmico de 2026.2. A data de hoje fica fixa na quarta semana
 * de aula para que os prazos da demonstração façam sentido em qualquer dia.
 */
export const CALENDAR: SemesterCalendar = {
  id: '2026.2',
  startsAt: '2026-08-03',
  endsAt: '2026-12-04',
  linkDeadline: '2026-09-12',
  midtermAt: '2026-10-09',
  finalAt: '2026-11-27',
  today: '2026-08-24',
};
