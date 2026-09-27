/** Toda URL do portal nasce aqui. Componentes nunca montam caminho à mão. */

export type ProjectTab = 'etapas' | 'plano' | 'demanda';
export type DemandTab = 'problema' | 'competencias' | 'perguntas' | 'inspiracao' | 'organizacao';

export const paths = {
  login: '/entrar',
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
} as const;
