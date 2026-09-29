/**
 * Chaves do React Query num só lugar. Uma mutation que muda o estado de outra
 * feature invalida pela chave daqui, sem repetir strings soltas.
 */
export const queryKeys = {
  account: ['account'],
  calendar: ['calendar'],
  demands: ['demands'],
  demand: (id: string) => ['demands', id],
  projects: ['projects'],
  project: (id: string) => ['projects', id],
  disciplines: ['disciplines'],
  skillCatalog: ['skill-catalog'],
  discipline: (id: string) => ['disciplines', id],
  organizations: ['organizations'],
  organization: (id: string) => ['organizations', id],
  /* Portal da organização: tudo sob "org", para não se misturar com o cache do docente. */
  org: ['org'],
  orgAccount: ['org', 'account'],
  orgProfile: ['org', 'profile'],
  orgDemands: ['org', 'demands'],
  orgDemand: (id: string) => ['org', 'demand', id],
  orgProjects: ['org', 'projects'],
  orgProject: (id: string) => ['org', 'project', id],
} as const;
