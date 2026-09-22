import type { OrganizationWithDemands } from '../types';

export const ALL = 'all';

export type OpenDemandFilter = typeof ALL | 'with-open' | 'without-open';

export interface OrganizationFilters {
  search: string;
  type: string;
  theme: string;
  openDemands: OpenDemandFilter;
}

const matchesOpenDemands = (organization: OrganizationWithDemands, filter: OpenDemandFilter) => {
  if (filter === 'with-open') return organization.openDemands.length > 0;
  if (filter === 'without-open') return organization.openDemands.length === 0;
  return true;
};

/** Organizações com demanda aberta aparecem primeiro: é o que o docente pode agir agora. */
export const filterOrganizations = (organizations: OrganizationWithDemands[], filters: OrganizationFilters) =>
  organizations
    .filter(
      (organization) =>
        organization.name.toLowerCase().includes(filters.search.trim().toLowerCase()) &&
        (filters.type === ALL || organization.type === filters.type) &&
        (filters.theme === ALL || organization.themes.includes(filters.theme)) &&
        matchesOpenDemands(organization, filters.openDemands),
    )
    .sort((a, b) => b.openDemands.length - a.openDemands.length);
