import type { Completion, Project, ProjectDetail } from '@/features/projects/types';

const FULL_SCHEDULE = Array<boolean>(12).fill(true);

const RUNNING_DETAIL_P1: ProjectDetail = {
  problem:
    'A regulação do Hospital das Clínicas recebe pedidos de consulta de 42 municípios e distribui por ordem de chegada, sem cruzar o perfil do pedido com a especialidade e a agenda real do médico. Pacientes do interior viajam e não são atendidos, enquanto vagas ficam abertas.',
  goals: [
    'Levantar com a equipe de regulação o fluxo atual de pedido, triagem e agendamento.',
    'Consolidar a fila de espera em base única, com tempo de espera por paciente.',
    'Especificar e implementar a regra de distribuição por perfil, agenda e distância.',
    'Entregar painel de acompanhamento da fila para a coordenação de regulação.',
  ],
  agreedDeliverable:
    'Protótipo funcional operando sobre dados reais anonimizados, com a regra de distribuição documentada em linguagem acessível à equipe.',
  milestones: [
    { week: 'Semana 1', label: 'Início e acesso aos dados', done: true },
    { week: 'Semana 4', label: 'Fluxo atual mapeado e validado', done: true },
    { week: 'Semana 8', label: 'Regra de distribuição especificada', done: true },
    { week: 'Semana 12', label: 'Entrega e apresentação ao parceiro', done: false },
  ],
  focalName: 'Renata Vasconcelos',
  focalRole: 'Coordenadora do núcleo de regulação',
  channel: 'E-mail institucional, reunião quinzenal por vídeo',
  healthLabel: 'Em execução, regular',
  healthNote: 'Oito das nove semanas corridas têm registro de andamento.',
  healthTone: 'ok',
  deadlines: [
    { label: 'Relatório parcial de extensão', date: '30/09', note: 'Gerado a partir dos registros de andamento.', urgent: false },
    { label: 'Confirmar carga horária das equipes', date: '12/09', note: 'Faltam 14 horas registradas para fechar a previsão.', urgent: true },
  ],
  teams: [
    {
      name: 'Equipe 1',
      scope: 'Consolidação da fila em base única e cálculo do tempo de espera por paciente.',
      members: [
        { name: 'Ana Beatriz Lima', enrollment: '2021100341', hours: '58h', concurrentProjects: 1, availability: '12h por semana' },
        { name: 'Caio Ferraz', enrollment: '2021100892', hours: '44h', concurrentProjects: 3, availability: '6h por semana' },
        { name: 'Marina Peixoto', enrollment: '2022101204', hours: '51h', concurrentProjects: 2, availability: '10h por semana' },
        { name: 'Tiago Nunes', enrollment: '2021100455', hours: '39h', concurrentProjects: 1, availability: '8h por semana' },
      ],
    },
    {
      name: 'Equipe 2',
      scope: 'Regra de distribuição por perfil, agenda e distância, e painel da coordenação.',
      members: [
        { name: 'Beatriz Rocha', enrollment: '2022101777', hours: '0h', concurrentProjects: 1, availability: '10h por semana' },
        { name: 'Daniel Vieira', enrollment: '2021100118', hours: '22h', concurrentProjects: 4, availability: '4h por semana' },
        { name: 'Helena Braga', enrollment: '2022101043', hours: '0h', concurrentProjects: 2, availability: '12h por semana' },
        { name: 'Rafael Coutinho', enrollment: '2021100963', hours: '0h', concurrentProjects: 1, availability: '8h por semana' },
        { name: 'Sofia Andrade', enrollment: '2022101560', hours: '0h', concurrentProjects: 1, availability: '10h por semana' },
      ],
    },
  ],
  log: [
    { author: 'Equipe 2', kind: 'one-off', date: '21/08/2026', attachments: ['ata-reuniao-21-08.pdf'], text: 'Reunião com a coordenadora de regulação para validar os critérios da regra. Ficou definido que distância entra como desempate, não como peso principal.' },
    { author: 'Equipe 1', kind: 'ongoing', date: '18/08/2026', attachments: ['modelo-base-fila.sql', 'amostra-anonimizada.csv'], text: 'Base consolidada com os pedidos de 2024 e 2025 já anonimizados. Cálculo de tempo de espera por paciente rodando sobre a base.' },
    { author: 'Paola Accioly', kind: 'one-off', date: '12/08/2026', attachments: [], text: 'Acompanhei a Equipe 1 no hospital. A regulação mostrou um caso em que o paciente viajou 180 km e voltou sem atendimento; virou o caso de referência do projeto.' },
    { author: 'Equipe 1', kind: 'ongoing', date: '04/08/2026', attachments: ['fluxo-atual-v2.png'], text: 'Fluxo atual de pedido, triagem e agendamento mapeado e validado com dois profissionais da regulação.' },
  ],
  hoursColumns: ['Levantamento', 'Modelagem', 'Validação', 'Apresentação'],
  hoursRows: [
    { name: 'Ana Beatriz Lima', enrollment: '2021100341', values: ['8h', '34h', '16h', '0h'] },
    { name: 'Caio Ferraz', enrollment: '2021100892', values: ['8h', '24h', '12h', '0h'] },
    { name: 'Marina Peixoto', enrollment: '2022101204', values: ['8h', '31h', '12h', '0h'] },
    { name: 'Tiago Nunes', enrollment: '2021100455', values: ['8h', '19h', '12h', '0h'] },
    { name: 'Daniel Vieira', enrollment: '2021100118', values: ['8h', '14h', '0h', '0h'] },
  ],
  plannedHours: 300,
};

const RUNNING_DETAIL_P2: ProjectDetail = {
  problem:
    'O NASE registra atendimento em três planilhas separadas, uma por profissional. A equipe não sabe quantos estudantes estão esperando nem há quanto tempo.',
  goals: [
    'Mapear os três formatos de planilha em uso e o que cada um registra.',
    'Definir base única com tratamento adequado de dado sensível de saúde.',
    'Entregar visão da fila por tempo de espera e por profissional.',
  ],
  agreedDeliverable: 'Prova de conceito com a base consolidada e a fila por tempo de espera, operando sobre dados reais anonimizados.',
  milestones: [
    { week: 'Semana 1', label: 'Início e acesso às planilhas', done: true },
    { week: 'Semana 4', label: 'Formatos mapeados', done: true },
    { week: 'Semana 8', label: 'Base única definida', done: false },
    { week: 'Semana 12', label: 'Entrega ao núcleo', done: false },
  ],
  focalName: 'Ana Cláudia Souto',
  focalRole: 'Coordenadora do núcleo',
  channel: 'E-mail institucional, reunião semanal presencial',
  healthLabel: 'Sem registro há 3 semanas',
  healthNote: 'O último registro foi em 01/08. Vale procurar a equipe antes da próxima reunião.',
  healthTone: 'attention',
  deadlines: [
    { label: 'Formar a segunda equipe', date: '05/09', note: 'A proposta prevê duas equipes; só uma foi formada.', urgent: true },
    { label: 'Relatório parcial de extensão', date: '30/09', note: 'Gerado a partir dos registros de andamento.', urgent: false },
  ],
  teams: [
    {
      name: 'Equipe 1',
      scope: 'Consolidação das três planilhas e visão da fila por tempo de espera.',
      members: [
        { name: 'Gustavo Amaral', enrollment: '2022101899', hours: '31h', concurrentProjects: 1, availability: '10h por semana' },
        { name: 'Larissa Melo', enrollment: '2021100674', hours: '28h', concurrentProjects: 3, availability: '5h por semana' },
        { name: 'Pedro Sampaio', enrollment: '2022101322', hours: '22h', concurrentProjects: 2, availability: '8h por semana' },
        { name: 'Yasmin Torres', enrollment: '2022101488', hours: '15h', concurrentProjects: 1, availability: '12h por semana' },
      ],
    },
  ],
  log: [
    { author: 'Equipe 1', kind: 'ongoing', date: '01/08/2026', attachments: ['comparativo-planilhas.xlsx'], text: 'Três formatos de planilha mapeados. Cada profissional registra campos diferentes, e duas planilhas não têm data de entrada.' },
    { author: 'Paola Accioly', kind: 'one-off', date: '24/07/2026', attachments: [], text: 'Primeira reunião no núcleo. A coordenadora entregou as três planilhas já anonimizadas.' },
  ],
  hoursColumns: ['Levantamento', 'Modelagem', 'Migração', 'Validação'],
  hoursRows: [
    { name: 'Gustavo Amaral', enrollment: '2022101899', values: ['10h', '21h', '0h', '0h'] },
    { name: 'Larissa Melo', enrollment: '2021100674', values: ['10h', '18h', '0h', '0h'] },
    { name: 'Pedro Sampaio', enrollment: '2022101322', values: ['10h', '12h', '0h', '0h'] },
    { name: 'Yasmin Torres', enrollment: '2022101488', values: ['10h', '5h', '0h', '0h'] },
  ],
  plannedHours: 160,
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
    title: 'Fila justa: regulação de consultas por perfil clínico',
    disciplineName: 'Desenvolvimento de Software',
    partnerName: 'Hospital das Clínicas',
    demandId: 'hc',
    proposalId: 'pr1',
    teamsFormed: 2,
    teamsPlanned: 2,
    students: 9,
    hours: 214,
    plannedHours: 540,
    weeksLeft: 9,
    weeklyLog: [true, true, true, true, true, true, false, true, true, false, false, false],
    elapsedWeeks: 9,
    lastUpdate: 'Última atualização por Equipe 2, em 21/08',
    detail: RUNNING_DETAIL_P1,
  },
  {
    id: 'p2',
    stage: 'running',
    title: 'Fila à vista: registro consolidado de atendimentos',
    disciplineName: 'Engenharia de Software 1',
    partnerName: 'NASE',
    demandId: 'nase',
    proposalId: 'pr2',
    teamsFormed: 1,
    teamsPlanned: 2,
    students: 4,
    hours: 96,
    plannedHours: 240,
    weeksLeft: 9,
    weeklyLog: [true, true, true, true, true, false, false, false, false, false, false, false],
    elapsedWeeks: 8,
    lastUpdate: 'Última atualização por Equipe 1, em 01/08',
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
