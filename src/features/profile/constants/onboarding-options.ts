export interface PracticeGroup {
  id: 'tech' | 'methods' | 'deliverables';
  title: string;
  addPlaceholder: string;
  options: string[];
  /** Pré-marcadas a partir das disciplinas que o docente leciona. */
  suggested: string[];
}

export const PRACTICE_GROUPS: PracticeGroup[] = [
  {
    id: 'tech',
    title: 'Tecnologias',
    addPlaceholder: 'Falta uma tecnologia? Escreva e adicione',
    options: ['Java', 'Python', 'JavaScript', 'React', 'Node', 'SQL e modelagem relacional', 'Git', 'Docker', 'Android', 'APIs REST'],
    suggested: ['Java', 'SQL e modelagem relacional', 'Git', 'APIs REST'],
  },
  {
    id: 'methods',
    title: 'Métodos de trabalho',
    addPlaceholder: 'Falta um método? Escreva e adicione',
    options: [
      'Scrum', 'Kanban', 'Revisão de código', 'Programação em par', 'Testes automatizados',
      'Levantamento de requisitos com usuário', 'Modelagem de processos', 'Pesquisa com usuário', 'Prototipação', 'Entrega em ciclos curtos',
    ],
    suggested: ['Revisão de código', 'Levantamento de requisitos com usuário', 'Entrega em ciclos curtos'],
  },
  {
    id: 'deliverables',
    title: 'Tipos de entregável',
    addPlaceholder: 'Falta um entregável? Escreva e adicione',
    options: [
      'Protótipo navegável', 'Prova de conceito', 'Aplicação web', 'Aplicativo móvel', 'Painel de dados',
      'API', 'Relatório técnico', 'Pesquisa com usuários', 'Documentação de processo', 'Base de dados modelada',
    ],
    suggested: ['Protótipo navegável', 'Aplicação web', 'Base de dados modelada'],
  },
];

export const THEMES = [
  'Saúde pública', 'Educação', 'Gestão pública', 'Meio ambiente', 'Cultura',
  'Inclusão e acessibilidade', 'Segurança alimentar', 'Mobilidade urbana', 'Direitos humanos', 'Economia solidária',
];

export const HISTORY_OPTIONS = [
  'Projeto com órgão público', 'Projeto com organização social', 'Projeto com empresa', 'Turma inteira em uma só demanda',
  'Equipes com recortes separados', 'Entrega direta ao parceiro', 'Projeto que virou continuidade', 'Nunca conduzi extensão',
];

export const HISTORY_SOURCES = [
  { id: 'mark', title: 'Marcar o que eu já conduzi', note: 'Alguns toques, nenhuma digitação' },
  { id: 'paste', title: 'Colar o resumo de um projeto anterior', note: 'Só se você tiver um texto à mão' },
  { id: 'skip', title: 'Pular, prefiro que a plataforma aprenda com o uso', note: 'Você pode voltar a este passo pelo perfil de prática' },
] as const;

export const ONBOARDING_STEPS = [
  { title: 'O que você pratica de verdade?', support: 'A ementa não conta tudo. Marque o que você realmente conduz com seus estudantes.' },
  { title: 'Temas que combinam com você', support: 'Duas listas curtas. A segunda evita que você receba demanda fora do que defende.' },
  { title: 'Seu histórico ajuda o sistema a te conhecer', support: 'Nenhuma destas opções é obrigatória. A plataforma também aprende com o uso.' },
];
