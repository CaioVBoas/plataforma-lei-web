import type { Demand } from '@/domain/types';
import type { DemandDetail } from '@/features/demands/types';
import { db, findOrThrow, NotFoundError } from '../db';

/** Regra 1: o cardápio só tem demandas abertas. */
export const listOpenDemands = (): Demand[] => db.demands.filter((demand) => demand.status === 'open');

export const getDemand = (id: string): DemandDetail => {
  const demand = findOrThrow(db.demands, id, 'Demanda não encontrada.');
  const project = db.projects.find((candidate) => candidate.demandId === id);

  if (demand.status === 'in-project' && !project) {
    throw new NotFoundError('Esta demanda já foi levada para a disciplina de outro docente.');
  }

  const { contact: _contact, ...organization } = findOrThrow(db.organizations, demand.organization.id, 'Organização não encontrada.');
  return { demand, organization, projectId: project?.id };
};
