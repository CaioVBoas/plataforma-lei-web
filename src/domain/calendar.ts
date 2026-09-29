import type { IsoDate, SemesterCalendar } from './types';

const DAY_MS = 86_400_000;

/* As datas são lidas em UTC para que o fuso do navegador nunca mude o dia. */
const toTime = (date: IsoDate) => Date.parse(`${date}T00:00:00Z`);
const fromTime = (time: number): IsoDate => new Date(time).toISOString().slice(0, 10);

export const addDays = (date: IsoDate, days: number): IsoDate => fromTime(toTime(date) + days * DAY_MS);

/** Dias de `from` até `to`. Negativo quando `to` já passou. */
export const daysBetween = (from: IsoDate, to: IsoDate) => Math.round((toTime(to) - toTime(from)) / DAY_MS);

export const earliest = (...dates: IsoDate[]): IsoDate => [...dates].sort()[0];

// Abreviação própria: a do Intl em pt-BR termina em ponto ("ago.") e colide com a pontuação da frase.
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** "21 ago 2026". O único formato de data do portal; tempo relativo só entra como complemento. */
export const formatShortDate = (date: IsoDate) => {
  const [year, month, day] = date.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
};

/** "hoje", "amanhã", "em 5 dias", "há 3 dias". */
export const formatRelativeDays = (from: IsoDate, to: IsoDate) => {
  const days = daysBetween(from, to);
  if (days === 0) return 'hoje';
  if (days === 1) return 'amanhã';
  if (days === -1) return 'ontem';
  return days > 0 ? `em ${days} dias` : `há ${-days} dias`;
};

export const semesterWeek = (calendar: SemesterCalendar) => {
  const total = Math.ceil(daysBetween(calendar.startsAt, calendar.endsAt) / 7);
  const current = Math.min(total, Math.max(0, Math.floor(daysBetween(calendar.startsAt, calendar.today) / 7) + 1));
  return { current, total };
};

export const isLinkWindowOpen = (calendar: SemesterCalendar) => daysBetween(calendar.today, calendar.linkDeadline) >= 0;
