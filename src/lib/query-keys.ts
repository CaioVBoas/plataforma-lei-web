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
} as const;
