import type { UserRole } from '@/features/auth/types';

/** Toda URL do portal nasce aqui. Componentes nunca montam caminho à mão. */

export type ProjectTab = 'etapas' | 'plano' | 'demanda';
export type DemandTab = 'problema' | 'competencias' | 'perguntas' | 'inspiracao' | 'organizacao';
export type OrgDemandTab = 'demanda' | 'perguntas' | 'cardapio';
/** Abas da lista de demandas da organização. "vez" junta o que espera algo de vocês. */
export type OrgDemandsTab = 'vez' | 'todas' | OrgDemandsView;
export type OrgDemandsView = 'preparo' | 'cardapio' | 'projeto' | 'concluidas';

export const paths = {
  /** Portal público: apresenta o L.E.I. e leva cada perfil para a entrada ou o cadastro. */
  landing: '/',
  login: '/entrar',
  /** Sem perfil, a entrada pergunta primeiro como a pessoa participa. */
  loginAs: (role: UserRole) => `/entrar?perfil=${role}`,
  signup: (role?: UserRole) => (role ? `/cadastro?perfil=${role}` : '/cadastro'),
  home: '/inicio',
  guide: '/como-funciona',
  /** Tudo que pede decisão ou é novidade para o docente. */
  notifications: '/avisos',
  /** O cardápio de demandas: o que as organizações pediram e ainda não virou projeto. */
  menu: '/cardapio',
  demand: (id: string, tab?: DemandTab) => (tab && tab !== 'problema' ? `/cardapio/${id}?aba=${tab}` : `/cardapio/${id}`),
  projects: '/projetos',
  project: (id: string, tab?: ProjectTab) => (tab && tab !== 'etapas' ? `/projetos/${id}?aba=${tab}` : `/projetos/${id}`),
  disciplines: '/disciplinas',
  /** Abre o cadastro de disciplina direto, a partir do Início. */
  newDiscipline: '/disciplinas?nova=1',
  discipline: (id: string) => `/disciplinas/${id}`,
  /** Direto no formulário da turma, dentro do detalhe. */
  disciplineEdit: (id: string) => `/disciplinas/${id}#turma`,
  disciplineMatches: (id: string) => `/disciplinas/${id}#demandas`,
  organizations: '/organizacoes',
  organization: (id: string) => `/organizacoes/${id}`,
  account: '/conta',

  /* Portal da organização. */
  orgHome: '/organizacao',
  orgNotifications: '/organizacao/avisos',
  /** Sem aba, a lista abre em "Sua vez" quando há algo esperando, senão em "Todas". */
  orgDemands: (tab?: OrgDemandsTab) => (tab ? `/organizacao/demandas?ver=${tab}` : '/organizacao/demandas'),
  orgNewDemand: '/organizacao/demandas/nova',
  orgDemand: (id: string, tab?: OrgDemandTab) =>
    tab && tab !== 'demanda' ? `/organizacao/demandas/${id}?aba=${tab}` : `/organizacao/demandas/${id}`,
  orgEditDemand: (id: string) => `/organizacao/demandas/${id}/editar`,
  orgProjects: '/organizacao/projetos',
  orgProject: (id: string) => `/organizacao/projetos/${id}`,
  orgProfile: '/organizacao/perfil',
  /** Todas as perguntas dos docentes, de todas as demandas, num lugar só. */
  orgQuestions: (view?: 'respondidas') => (view ? `/organizacao/perguntas?ver=${view}` : '/organizacao/perguntas'),
  orgGuide: '/organizacao/como-funciona',
} as const;

/** Onde cada perfil cai depois de entrar. */
export const homeFor = (role: UserRole) => (role === 'organizacao' ? paths.orgHome : paths.home);
