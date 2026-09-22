import type { Reservation, ReservationsByKind } from '@/features/applications/types';
import type { Demand } from '@/features/matchmaking/types';
import { db } from '../db';

const RESERVATION_BUSINESS_DAYS = 5;

const bestDisciplineName = (demand: Demand) => {
  const [bestId] = Object.entries(demand.matchByDiscipline).sort(([, a], [, b]) => b - a)[0] ?? [];
  return db.disciplines.find((discipline) => discipline.id === bestId)?.name ?? 'Disciplina não escolhida';
};

const toReservation = (demand: Demand, kind: Reservation['kind'], expiredOn?: string): Reservation => ({
  demandId: demand.id,
  kind,
  organizationName: demand.organizationName,
  organizationType: demand.organizationType,
  problem: demand.problem,
  intendedDiscipline: bestDisciplineName(demand),
  daysLeft: kind === 'active' ? (demand.reservationDaysLeft ?? RESERVATION_BUSINESS_DAYS) : 0,
  expiredOn,
  hasUnansweredQuestion: kind === 'active' && db.unansweredQuestions.has(demand.id),
  demandAvailable: demand.status === 'available',
});

const demandById = (id: string) => db.demands.find((demand) => demand.id === id);

export const listReservations = (): ReservationsByKind => ({
  active: db.demands.filter((demand) => demand.status === 'reserved-by-me').map((demand) => toReservation(demand, 'active')),
  released: db.releasedReservations
    .map(demandById)
    .filter((demand): demand is Demand => Boolean(demand))
    .map((demand) => toReservation(demand, 'released')),
  expired: db.expiredReservations.flatMap(({ demandId, expiredOn }) => {
    const demand = demandById(demandId);
    return demand ? [toReservation(demand, 'expired', expiredOn)] : [];
  }),
});
