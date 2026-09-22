import type { OrganizationDetail, OrganizationSummary } from '@/features/organizations/types';
import { db, findOrThrow } from '../db';

const openDemandsOf = (organizationId: string) =>
  db.demands.filter((demand) => demand.organization.id === organizationId && demand.status === 'open');

export const listOrganizations = (): OrganizationSummary[] =>
  db.organizations.map(({ contact: _contact, ...organization }) => ({ ...organization, openDemands: openDemandsOf(organization.id).length }));

export const getOrganization = (id: string): OrganizationDetail => {
  const { contact, ...organization } = findOrThrow(db.organizations, id, 'Organização não encontrada.');
  const myProjects = db.projects.filter((project) => project.organization.id === id);
  return {
    organization,
    // Regra 4: o contato só aparece para quem já tem projeto com a organização.
    contact: myProjects.length > 0 ? contact : undefined,
    openDemands: openDemandsOf(id),
    myProjects,
  };
};
