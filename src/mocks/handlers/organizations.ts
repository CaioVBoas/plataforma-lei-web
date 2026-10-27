import type { OrganizationDetail, OrganizationSummary } from '@/features/organizations/types';
import { db, findOrThrow } from '../db';

/** Demandas no cardápio, livres ou reservadas. */
const openDemandsOf = (organizationId: string) =>
  db.demands.filter((demand) => demand.organization.id === organizationId && demand.status !== 'in-project');

export const listOrganizations = (): OrganizationSummary[] =>
  db.organizations.map(({ contact: _contact, ...organization }) => ({ ...organization, openDemands: openDemandsOf(organization.id).length }));

/** Demandas e projetos saem enxutos, na mesma forma que a API devolve. */
export const getOrganization = (id: string): OrganizationDetail => {
  const { contact, ...organization } = findOrThrow(db.organizations, id, 'Organização não encontrada.');
  const myProjects = db.projects.filter((project) => project.organization.id === id);
  return {
    organization,
    // Regra 6: o contato só aparece para quem já tem projeto com a organização.
    contact: myProjects.length > 0 ? contact : undefined,
    openDemands: openDemandsOf(id).map(({ id: demandId, title }) => ({ id: demandId, title })),
    myProjects: myProjects.map(({ id: projectId, title, semester, disciplineName }) => ({ id: projectId, title, semester, disciplineName })),
  };
};
