import { addDays, daysBetween } from './calendar';
import type { Demand, IsoDate } from './types';

/**
 * A reserva guarda a demanda enquanto o docente decide: conversa com a turma,
 * com colegas, lê a demanda com calma. Ela é curta de propósito, para
 * ninguém segurar demanda que não vai levar.
 */
export const RESERVATION_DAYS = 7;

/** Limite de reservas ativas por docente, para uma pessoa não esvaziar o cardápio. */
export const MAX_ACTIVE_RESERVATIONS = 3;

export const reservationEnd = (today: IsoDate): IsoDate => addDays(today, RESERVATION_DAYS - 1);

export const isReservationExpired = (until: IsoDate, today: IsoDate) => daysBetween(today, until) < 0;

export const isMyReservation = (demand: Pick<Demand, 'status' | 'reservation'>) =>
  demand.status === 'reserved' && Boolean(demand.reservation?.mine);

/** Dias que ainda restam, contando hoje: reserva que acaba hoje tem 1 dia. */
export const reservationDaysLeft = (until: IsoDate, today: IsoDate) => daysBetween(today, until) + 1;
