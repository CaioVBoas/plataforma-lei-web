import type { Completion, Project, ProjectDetail } from '@/features/projects/types';

const FULL_SCHEDULE = Array<boolean>(12).fill(true);

const RUNNING_DETAIL_P1: ProjectDetail = {
  problem:
    'O estoque de doações da Mesa Brasil é anotado em caderno no centro de distribuição. As 60 instituições atendidas só descobrem o que há disponível quando chegam para retirar, e parte dos perecíveis vence antes de ser distribuída.',
  goals: [
    'Levantar com a equipe de logística o fluxo de entrada e saída de doações.',
    'Modelar o estoque em base única, com validade dos perecíveis.',
    'Publicar para as instituições a visão do que está disponível para retirada.',
    'Entregar alerta de perecíveis perto do vencimento para a coordenação.',
  ],
  agreedDeliverable:
    'Aplicação web em uso pela equipe de logística, com a vitrine de estoque aberta às instituições cadastradas.',
  milestones: [
    { week: 'Semana 1', label: 'Início e visita ao centro de distribuição', done: true },
    { week: 'Semana 4', label: 'Fluxo de doações mapeado e validado', done: true },
    { week: 'Semana 8', label: 'Estoque modelado com validade', done: false },
    { week: 'Semana 12', label: 'Entrega e apresentação ao parceiro', done: false },
  ],
  focalName: 'Cláudio Rangel',
  focalRole: 'Coordenador de logística',
  channel: 'E-mail e telefone, reunião quinzenal por vídeo',
  healthLabel: 'Em execução, regular',
  healthNote: 'As quatro semanas corridas têm registro de andamento.',
  healthTone: 'ok',
  deadlines: [
    { label: 'Confirmar carga horária das equipes', date: '12/09', note: 'A planilha de horas ainda não fecha a previsão da semana 4.', urgent: true },
    { label: 'Relatório parcial de extensão', date: '30/09', note: 'Gerado a partir dos registros de andamento.', urgent: false },
  ],
  teams: [
    {
      name: 'Equipe 1',
      scope: 'Modelagem do estoque em base única, com validade dos perecíveis.',
      members: [
        { name: 'Ana Beatriz Lima', enrollment: '2021100341', hours: '22h', concurrentProjects: 1, availability: '12h por semana' },
        { name: 'Caio Ferraz', enrollment: '2021100892', hours: '18h', concurrentProjects: 3, availability: '6h por semana' },
        { name: 'Marina Peixoto', enrollment: '2022101204', hours: '20h', concurrentProjects: 2, availability: '10h por semana' },
        { name: 'Tiago Nunes', enrollment: '2021100455', hours: '16h', concurrentProjects: 1, availability: '8h por semana' },
      ],
    },
    {
      name: 'Equipe 2',
      scope: 'Vitrine de estoque para as instituições e alerta de perecíveis.',
      members: [
        { name: 'Beatriz Rocha', enrollment: '2022101777', hours: '12h', concurrentProjects: 1, availability: '10h por semana' },
        { name: 'Daniel Vieira', enrollment: '2021100118', hours: '10h', concurrentProjects: 4, availability: '4h por semana' },
        { name: 'Helena Braga', enrollment: '2022101043', hours: '12h', concurrentProjects: 2, availability: '12h por semana' },
        { name: 'Rafael Coutinho', enrollment: '2021100963', hours: '10h', concurrentProjects: 1, availability: '8h por semana' },
        { name: 'Sofia Andrade', enrollment: '2022101560', hours: '8h', concurrentProjects: 1, availability: '10h por semana' },
      ],
    },
  ],
  log: [
    { author: 'Equipe 2', kind: 'one-off', date: '21/08/2026', attachments: ['ata-reuniao-21-08.pdf'], text: 'Reunião com o coordenador de logística para validar o que as instituições precisam ver. Ficou definido que a vitrine mostra só itens com mais de três dias de validade.' },
    { author: 'Equipe 1', kind: 'ongoing', date: '18/08/2026', attachments: ['modelo-estoque.sql'], text: 'Estoque dos últimos dois meses digitado a partir do caderno. Modelo de dados com validade por lote rodando.' },
    { author: 'Paola Accioly', kind: 'one-off', date: '12/08/2026', attachments: [], text: 'Acompanhei as duas equipes no centro de distribuição. A logística mostrou o caderno de entrada, que virou a referência do modelo.' },
    { author: 'Equipe 1', kind: 'ongoing', date: '06/08/2026', attachments: ['fluxo-doacoes-v1.png'], text: 'Fluxo de entrada e saída de doações mapeado e validado com a equipe de logística.' },
  ],
  hoursColumns: ['Levantamento', 'Modelagem', 'Validação', 'Apresentação'],
  hoursRows: [
    { name: 'Ana Beatriz Lima', enrollment: '2021100341', values: ['8h', '14h', '0h', '0h'] },
    { name: 'Caio Ferraz', enrollment: '2021100892', values: ['8h', '10h', '0h', '0h'] },
    { name: 'Marina Peixoto', enrollment: '2022101204', values: ['8h', '12h', '0h', '0h'] },
    { name: 'Tiago Nunes', enrollment: '2021100455', values: ['8h', '8h', '0h', '0h'] },
    { name: 'Daniel Vieira', enrollment: '2021100118', values: ['8h', '2h', '0h', '0h'] },
  ],
  plannedHours: 86,
};

const RUNNING_DETAIL_P2: ProjectDetail = {
  problem:
    'Na Casa de Passagem, o histórico de acompanhamento de cada jovem está em fichas de papel. Quando uma educadora sai, a próxima recomeça do zero.',
  goals: [
    'Levantar com a equipe pedagógica o que o histórico precisa registrar.',
    'Definir as regras de sigilo e de acesso antes de qualquer dado entrar.',
    'Entregar o registro contínuo de atendimentos para a equipe.',
  ],
  agreedDeliverable: 'Prova de conceito do registro de atendimento, com acesso por perfil e sem nenhum dado real fora da sede.',
  milestones: [
    { week: 'Semana 1', label: 'Acordo de sigilo com a equipe', done: true },
    { week: 'Semana 4', label: 'Requisitos validados com a coordenação', done: false },
    { week: 'Semana 8', label: 'Registro de atendimento em teste', done: false },
    { week: 'Semana 12', label: 'Entrega à equipe pedagógica', done: false },
  ],
  focalName: 'Sônia Maranhão',
  focalRole: 'Coordenadora pedagógica',
  channel: 'E-mail, reunião quinzenal presencial',
  healthLabel: 'Sem registro há 3 semanas',
  healthNote: 'O último registro foi em 04/08. Vale procurar a equipe antes da próxima reunião.',
  healthTone: 'attention',
  deadlines: [
    { label: 'Formar a segunda equipe', date: '05/09', note: 'A proposta prevê duas equipes; só uma foi formada.', urgent: true },
    { label: 'Relatório parcial de extensão', date: '30/09', note: 'Gerado a partir dos registros de andamento.', urgent: false },
  ],
  teams: [
    {
      name: 'Equipe 1',
      scope: 'Levantamento com a equipe pedagógica e regras de sigilo.',
      members: [
        { name: 'Gustavo Amaral', enrollment: '2022101899', hours: '9h', concurrentProjects: 1, availability: '10h por semana' },
        { name: 'Larissa Melo', enrollment: '2021100674', hours: '9h', concurrentProjects: 3, availability: '5h por semana' },
        { name: 'Pedro Sampaio', enrollment: '2022101322', hours: '9h', concurrentProjects: 2, availability: '8h por semana' },
        { name: 'Yasmin Torres', enrollment: '2022101488', hours: '9h', concurrentProjects: 1, availability: '12h por semana' },
      ],
    },
  ],
  log: [
    { author: 'Equipe 1', kind: 'ongoing', date: '04/08/2026', attachments: ['acordo-sigilo.pdf'], text: 'Acordo de sigilo assinado por toda a equipe. Nenhuma ficha sai da sede.' },
    { author: 'Paola Accioly', kind: 'one-off', date: '03/08/2026', attachments: [], text: 'Primeira reunião na sede com a coordenadora pedagógica. Ela apresentou o modelo de ficha usado hoje.' },
  ],
  hoursColumns: ['Levantamento', 'Modelagem', 'Validação', 'Apresentação'],
  hoursRows: [
    { name: 'Gustavo Amaral', enrollment: '2022101899', values: ['6h', '3h', '0h', '0h'] },
    { name: 'Larissa Melo', enrollment: '2021100674', values: ['6h', '3h', '0h', '0h'] },
    { name: 'Pedro Sampaio', enrollment: '2022101322', values: ['6h', '3h', '0h', '0h'] },
    { name: 'Yasmin Torres', enrollment: '2022101488', values: ['6h', '3h', '0h', '0h'] },
  ],
  plannedHours: 60,
};

interface CompletedSeed {
  id: string;
  title: string;
  disciplineName: string;
  partnerName: string;
  teams: number;
  students: number;
  hours: number;
  plannedHours: number;
  focalName: string;
  focalRole: string;
  deliverable: string;
  completion: Omit<Completion, 'publishedOnShowcase'>;
}

/**
 * Projetos concluídos antes da plataforma existir: só o que foi entregue e
 * certificado foi preservado, sem registros semanais nem planilha de horas.
 */
const completedProject = (seed: CompletedSeed): Project => ({
  id: seed.id,
  stage: 'completed',
  title: seed.title,
  disciplineName: seed.disciplineName,
  partnerName: seed.partnerName,
  teamsFormed: seed.teams,
  teamsPlanned: seed.teams,
  students: seed.students,
  hours: seed.hours,
  plannedHours: seed.plannedHours,
  weeksLeft: 0,
  weeklyLog: FULL_SCHEDULE,
  elapsedWeeks: 12,
  lastUpdate: `Encerrado com entrega ao parceiro em ${seed.completion.date}`,
  completion: { ...seed.completion, publishedOnShowcase: false },
  detail: {
    problem: seed.deliverable,
    goals: [],
    agreedDeliverable: seed.deliverable,
    milestones: [
      { week: 'Semana 1', label: 'Início com o parceiro', done: true },
      { week: 'Semana 12', label: 'Entrega ao parceiro', done: true },
    ],
    focalName: seed.focalName,
    focalRole: seed.focalRole,
    channel: 'E-mail institucional',
    healthLabel: 'Concluído',
    healthNote: `Entregue ao parceiro em ${seed.completion.date}.`,
    healthTone: 'ok',
    deadlines: [],
    teams: [],
    log: [],
    hoursColumns: [],
    hoursRows: [],
    plannedHours: seed.plannedHours,
  },
});

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    stage: 'running',
    title: 'Estoque à vista: doações do banco de alimentos',
    disciplineName: 'Desenvolvimento de Software',
    partnerName: 'Mesa Brasil Recife',
    demandId: 'mesa',
    proposalId: 'pr1',
    teamsFormed: 2,
    teamsPlanned: 2,
    students: 9,
    hours: 128,
    plannedHours: 540,
    weeksLeft: 12,
    weeklyLog: [true, true, true, true, false, false, false, false, false, false, false, false],
    elapsedWeeks: 4,
    lastUpdate: 'Última atualização por Equipe 2, em 21/08',
    detail: RUNNING_DETAIL_P1,
  },
  {
    id: 'p2',
    stage: 'running',
    title: 'Histórico que acompanha: registro de atendimento das jovens',
    disciplineName: 'Engenharia de Software 1',
    partnerName: 'Casa de Passagem',
    demandId: 'casa',
    proposalId: 'pr2',
    teamsFormed: 1,
    teamsPlanned: 2,
    students: 4,
    hours: 36,
    plannedHours: 240,
    weeksLeft: 12,
    weeklyLog: [true, false, false, false, false, false, false, false, false, false, false, false],
    elapsedWeeks: 4,
    lastUpdate: 'Última atualização por Equipe 1, em 04/08',
    detail: RUNNING_DETAIL_P2,
  },
  completedProject({
    id: 'c1',
    title: 'Triagem de encaminhamentos no ambulatório',
    disciplineName: 'Desenvolvimento de Software',
    partnerName: 'Hospital das Clínicas',
    teams: 2,
    students: 10,
    hours: 540,
    plannedHours: 540,
    focalName: 'Renata Vasconcelos',
    focalRole: 'Coordenadora do núcleo de regulação',
    deliverable: 'Painel de triagem em uso pela equipe do ambulatório desde janeiro.',
    completion: { date: '12/12/2025', semester: '2025.2', certifiedHours: 540, report: 'pending' },
  }),
  completedProject({
    id: 'c2',
    title: 'Mapeamento de fluxo de atendimento de campo',
    disciplineName: 'Engenharia de Software 1',
    partnerName: 'Prefeitura do Recife',
    teams: 2,
    students: 8,
    hours: 384,
    plannedHours: 400,
    focalName: 'Igor Bezerra',
    focalRole: 'Gerente de inovação da secretaria executiva',
    deliverable: 'Fluxo de atendimento documentado e validado com as seis regionais.',
    completion: { date: '18/07/2025', semester: '2025.1', certifiedHours: 384, report: 'sent' },
  }),
  completedProject({
    id: 'c3',
    title: 'Registro comunitário de pontos de alagamento',
    disciplineName: 'Desenvolvimento de Software',
    partnerName: 'Coletivo Griô, Várzea',
    teams: 1,
    students: 5,
    hours: 240,
    plannedHours: 240,
    focalName: 'Lourdes Alves',
    focalRole: 'Coordenadora do coletivo',
    deliverable: 'Mapa comunitário mantido pelo coletivo, usado em duas audiências públicas.',
    completion: { date: '13/12/2024', semester: '2024.2', certifiedHours: 240, report: 'approved' },
  }),
];
