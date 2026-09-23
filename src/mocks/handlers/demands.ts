import { isMyReservation, isReservationExpired, MAX_ACTIVE_RESERVATIONS, reservationEnd } from '@/domain/reservation';
import type { Demand } from '@/domain/types';
import type { DemandDetail } from '@/features/demands/types';
import { db, findOrThrow, NotFoundError, RuleError } from '../db';

/**
 * Reserva vencida volta ao cardápio. O backend real faria isso numa rotina
 * diária; aqui acontece antes de qualquer leitura, o que dá no mesmo.
 */
const expireReservations = () => {
  for (const demand of db.demands) {
    if (demand.status === 'reserved' && demand.reservation && isReservationExpired(demand.reservation.until, db.calendar.today)) {
      demand.status = 'open';
      demand.reservation = undefined;
    }
  }
};

const findDemand = (id: string) => findOrThrow(db.demands, id, 'Demanda não encontrada.');

/** O cardápio mostra o que está aberto e o que está reservado; o que virou projeto sai (regra 3). */
export const listMenu = (): Demand[] => {
  expireReservations();
  return db.demands.filter((demand) => demand.status !== 'in-project');
};

export const getDemand = (id: string): DemandDetail => {
  expireReservations();
  const demand = findDemand(id);
  const project = db.projects.find((candidate) => candidate.demandId === id);

  if (demand.status === 'in-project' && !project) {
    throw new NotFoundError('Esta demanda já foi levada para a disciplina de outro docente.');
  }

  const { contact: _contact, ...organization } = findOrThrow(db.organizations, demand.organization.id, 'Organização não encontrada.');
  return { demand, organization, projectId: project?.id };
};

export const reserveDemand = (id: string): Demand => {
  expireReservations();
  const demand = findDemand(id);
  if (demand.status !== 'open') throw new RuleError('Esta demanda não está mais livre no cardápio.');
  if (db.demands.filter(isMyReservation).length >= MAX_ACTIVE_RESERVATIONS) {
    throw new RuleError(`Você já tem ${MAX_ACTIVE_RESERVATIONS} reservas. Libere uma ou leve alguma para a disciplina antes de reservar outra.`);
  }
  demand.status = 'reserved';
  demand.reservation = { teacherName: db.account.name, mine: true, until: reservationEnd(db.calendar.today) };
  demand.watching = false;
  return demand;
};

export const releaseReservation = (id: string): Demand => {
  const demand = findDemand(id);
  if (!isMyReservation(demand)) throw new RuleError('Esta reserva não é sua.');
  demand.status = 'open';
  demand.reservation = undefined;
  return demand;
};

/** "Avise-me se liberar": só faz sentido para reserva de outra pessoa. */
export const toggleWatch = (id: string): Demand => {
  const demand = findDemand(id);
  if (demand.status !== 'reserved' || demand.reservation?.mine) throw new RuleError('O aviso vale só para demandas reservadas por outro docente.');
  demand.watching = !demand.watching;
  return demand;
};
