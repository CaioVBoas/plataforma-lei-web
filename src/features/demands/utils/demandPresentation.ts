import { daysBetween, formatShortDate } from '@/domain/calendar';
import type { DisciplineMatch } from '@/domain/matching';
import { reservationDaysLeft } from '@/domain/reservation';
import type { Demand, DemandConstraint, IsoDate, ScopeFit } from '@/domain/types';
import type { StatusTone } from '@/components/ui/statusLabel';

/** Publicada há até uma semana: aparece como nova. */
const NEW_FOR_DAYS = 7;

export const isNew = (demand: Demand, today: IsoDate) => daysBetween(demand.publishedAt, today) <= NEW_FOR_DAYS;

export const SCOPE_COPY: Record<ScopeFit, { label: string; tone: StatusTone }> = {
  fits: { label: 'Cabe no semestre', tone: 'neutral' },
  'needs-cut': { label: 'Precisa de recorte', tone: 'caution' },
};

/** Versão curta para tag: a disciplina que mais combina, ou por que nenhuma combina. */
export const matchTag = (best: DisciplineMatch | undefined): { label: string; tone: StatusTone } => {
  if (!best) return { label: 'Sem disciplina cadastrada', tone: 'neutral' };
  if (best.fits) return { label: best.discipline.name, tone: 'accent' };
  return { label: best.aboveLevel ? 'Acima do nível das suas turmas' : 'Não combina com suas turmas', tone: 'neutral' };
};

/** O que pesa na rotina da turma, dito antes de aceitar. */
export const CONSTRAINT_COPY: Record<DemandConstraint, { label: string; detail: string }> = {
  'on-site': { label: 'Presencial', detail: 'A turma precisa ir até a organização em parte do semestre.' },
  'sensitive-data': { label: 'Dados sensíveis', detail: 'Há dados pessoais. A turma trabalha com dados anonimizados e segue a LGPD.' },
  confidential: { label: 'Sigilo', detail: 'Parte do que a turma vê não pode ser divulgada. Combine as regras na reunião de abertura.' },
};

/** O que cabe num semestre, dito no começo para a organização não esperar um sistema pronto. */
export const SEMESTER_DELIVERY =
  'Pesquisa com usuários, protótipo ou prova de conceito. Um sistema pronto para uso costuma ficar fora de um semestre; combine isso com a organização na reunião de abertura.';

/** "último dia", "2 dias restantes" */
export const daysLeftLabel = (until: IsoDate, today: IsoDate) => {
  const days = reservationDaysLeft(until, today);
  return days <= 1 ? 'último dia' : `${days} dias restantes`;
};

/** Rótulo curto da reserva, para o cartão do cardápio. Undefined quando a demanda está livre. */
export const reservationBadge = (demand: Demand, today: IsoDate) => {
  if (demand.status !== 'reserved' || !demand.reservation) return undefined;
  const { reservation } = demand;
  return reservation.mine
    ? `Sua reserva, ${daysLeftLabel(reservation.until, today)}`
    : `Reservada por ${reservation.teacherName} até ${formatShortDate(reservation.until)}`;
};
