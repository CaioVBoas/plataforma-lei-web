import type { Demand } from '../types';

export type DemandSegment = 'all' | 'new' | 'mine' | 'no-interest';

export interface DemandFilters {
  search: string;
  segment: DemandSegment;
  fitsOnly: boolean;
}

/** Demanda publicada há até uma semana conta como nova. */
const NEW_DEMAND_MAX_DAYS = 7;

const matchesSearch = (demand: Demand, search: string) => {
  const query = search.trim().toLowerCase();
  if (!query) return true;
  const haystack = [demand.organizationName, demand.problem, ...demand.competencies.map((item) => item.name)].join(' ');
  return haystack.toLowerCase().includes(query);
};

const SEGMENT_RULES: Record<DemandSegment, (demand: Demand) => boolean> = {
  all: () => true,
  new: (demand) => demand.publishedDaysAgo <= NEW_DEMAND_MAX_DAYS,
  mine: (demand) => demand.status === 'reserved-by-me',
  'no-interest': (demand) => demand.hasNoInterested,
};

export const filterDemands = (demands: Demand[], { search, segment, fitsOnly }: DemandFilters) =>
  demands.filter(
    (demand) =>
      matchesSearch(demand, search) && (!fitsOnly || demand.viability !== 'does-not-fit') && SEGMENT_RULES[segment](demand),
  );
