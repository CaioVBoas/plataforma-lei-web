import { matchDiscipline } from '@/domain/matching';
import type { Demand, Discipline } from '@/domain/types';

/**
 * Demandas do cardápio que a turma pode receber agora e com que ela combina.
 * Reservada por colega não está disponível; a reserva do próprio docente, sim.
 */
export const matchingDemands = <D extends Discipline>(menu: Demand[], discipline: D) =>
  menu
    .filter((demand) => demand.status === 'open' || demand.reservation?.mine)
    .map((demand) => ({ demand, match: matchDiscipline(demand, discipline) }))
    .filter(({ match }) => match.fits);
