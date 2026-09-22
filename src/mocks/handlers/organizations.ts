import type { OrganizationWithDemands } from '@/features/organizations/types';
import { db, NotFoundError } from '../db';
import { ORGANIZATIONS } from '../seed/organizations';

/** Só conta como aberta a demanda disponível no cardápio, não a reservada. */
const withOpenDemands = (organization: (typeof ORGANIZATIONS)[number]): OrganizationWithDemands => ({
  ...organization,
  openDemands: db.demands
    .filter((demand) => demand.organizationId === organization.id && demand.status === 'available')
    .map((demand) => ({
      id: demand.id,
      problem: demand.problem,
      affectedPublic: demand.affectedPublic,
      publishedDaysAgo: demand.publishedDaysAgo,
    })),
});

export const listOrganizations = (): OrganizationWithDemands[] => ORGANIZATIONS.map(withOpenDemands);

export const getOrganization = (id: string): OrganizationWithDemands => {
  const organization = ORGANIZATIONS.find((candidate) => candidate.id === id);
  if (!organization) throw new NotFoundError('Organização', id);
  return withOpenDemands(organization);
};
