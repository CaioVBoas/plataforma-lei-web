/**
 * Único lugar que conhece as URLs do app. As rotas seguem o português do kit de
 * prototipação (ex.: /entrar), já que são visíveis ao docente.
 */
export const paths = {
  login: '/entrar',
  onboarding: '/primeiros-passos',
  menu: '/cardapio',
  demand: (demandId: string) => `/demandas/${demandId}`,
  linkDemand: (demandId: string) => `/demandas/${demandId}/vincular`,
  reservations: '/minhas-propostas',
  proposals: '/rascunhos',
  proposal: (proposalId: string) => `/rascunhos/${proposalId}`,
  runningProjects: '/projetos/em-execucao',
  completedProjects: '/projetos/concluidos',
  project: (projectId: string, tab?: string) => `/projetos/${projectId}${tab ? `?aba=${tab}` : ''}`,
  disciplines: '/disciplinas',
  newDiscipline: '/disciplinas?cadastrar=1',
  discipline: (disciplineId: string, tab?: string) => `/disciplinas/${disciplineId}${tab ? `?aba=${tab}` : ''}`,
  organizations: '/organizacoes',
  organization: (organizationId: string) => `/organizacoes/${organizationId}`,
  notifications: '/notificacoes',
  account: '/perfil',
  practice: '/perfil/pratica',
  corrections: '/perfil/historico',
} as const;
