import { daysBetween, formatShortDate } from '@/domain/calendar';
import type { DisciplineMatch } from '@/domain/matching';
import { reservationDaysLeft } from '@/domain/reservation';
import type { Demand, IsoDate, ScopeFit } from '@/domain/types';
import type { StatusTone } from '@/components/ui/statusLabel';

/** Publicada há até uma semana: aparece como nova. */
const NEW_FOR_DAYS = 7;

export const isNew = (demand: Demand, today: IsoDate) => daysBetween(demand.publishedAt, today) <= NEW_FOR_DAYS;

export const SCOPE_COPY: Record<ScopeFit, { label: string; tone: StatusTone }> = {
  fits: { label: 'Cabe no semestre', tone: 'neutral' },
  'needs-cut': { label: 'Precisa de recorte', tone: 'caution' },
};

/** "Combina com Desenvolvimento de Software, 3 de 4 competências", sem percentual inventado. */
export const matchLine = (best: DisciplineMatch | undefined, demand: Demand) => {
  if (!best) return 'Cadastre suas disciplinas para ver se combina';
  return best.fits ? `Combina com ${best.discipline.name}, ${best.covered.length} de ${demand.skills.length} competências` : 'Não combina com suas disciplinas';
};

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
