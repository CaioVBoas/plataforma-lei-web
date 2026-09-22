import type { Proposal, ProposalSection, WorkloadRow } from '@/features/proposals/types';

/** Estrutura das seções do cadastro de ação de extensão no SIGAA, com os limites de cada campo. */
const SIGAA_STRUCTURE: Omit<ProposalSection, 'text'>[] = [
  { title: 'Título do projeto', limit: 150 },
  { title: 'Resumo', limit: 1500 },
  { title: 'Justificativa', limit: 2000 },
  { title: 'Objetivo geral e objetivos específicos', limit: 1500 },
  {
    title: 'Metodologia',
    limit: 2000,
    institutionalNote: 'Campo obrigatório no SIGAA: falta definir o período de execução das atividades.',
  },
  { title: 'Resultados esperados', limit: 1200 },
  { title: 'Público beneficiado', limit: 800 },
];

/** Texto gerado a partir da demanda e da ementa, na ordem de SIGAA_STRUCTURE. */
const GENERATED_TEXTS: Record<string, string[]> = {
  hc: [
    'Fila justa: regulação de consultas por perfil clínico no Hospital das Clínicas',
    'O projeto atua sobre a fila de espera da central de regulação do Hospital das Clínicas, que hoje distribui pedidos de consulta de 42 municípios por ordem de chegada. Estudantes da disciplina Desenvolvimento de Software, organizados em duas equipes, vão levantar o fluxo atual com a equipe de regulação, consolidar a fila em base única e especificar uma regra de distribuição que considere perfil clínico, agenda do profissional e deslocamento do paciente. A entrega ao parceiro é um protótipo funcional operando sobre dados reais anonimizados, acompanhado da documentação da regra proposta.',
    'A central de regulação recebe pedidos de consulta de 42 municípios e os distribui por ordem de chegada, sem cruzar o perfil do pedido com a especialidade e a agenda real do médico. O resultado é duplo: pacientes do interior viajam e não são atendidos, e vagas ficam abertas por incompatibilidade que só se descobre no dia. A equipe de regulação, com 14 profissionais, não tem hoje visibilidade do tempo de espera real por paciente. A ação de extensão coloca a turma diante de um problema público concreto, com dados reais e ponto focal institucional definido, e devolve ao parceiro um instrumento de gestão de fila que não existe hoje na rede. Para os estudantes, é a oportunidade de aplicar modelagem de dados e regras de negócio em contexto onde o erro tem consequência social visível.',
    'Objetivo geral: tornar visível a fila de espera da regulação do Hospital das Clínicas e propor regra de distribuição de vagas que considere perfil clínico, agenda do profissional e deslocamento do paciente.\n\nObjetivos específicos:\n1. Levantar com a equipe de regulação o fluxo atual de pedido, triagem e agendamento.\n2. Consolidar a fila de espera em base única, com tempo de espera por paciente.\n3. Especificar e implementar a regra de distribuição por perfil, agenda e distância.\n4. Entregar painel de acompanhamento da fila para a coordenação de regulação.\n5. Documentar a regra proposta em linguagem acessível à equipe do hospital.',
    'O trabalho segue em ciclos de duas semanas, com reunião quinzenal remota entre as equipes e o núcleo de regulação. Nas primeiras quatro semanas as equipes acompanham a rotina da central e levantam o fluxo atual, produzindo o mapa do processo validado pela coordenadora do núcleo. Nas oito semanas seguintes cada equipe desenvolve seu recorte: uma trata da consolidação da base e do cálculo de tempo de espera, a outra da regra de distribuição e da interface de acompanhamento. As quatro semanas finais são de integração, teste com a equipe do hospital e preparação da entrega. Toda decisão de escopo é registrada e revista na reunião quinzenal.',
    'Ao final do semestre espera-se entregar ao Hospital das Clínicas a fila de espera consolidada em base única, com tempo de espera calculado por paciente, e um protótipo funcional da regra de distribuição operando sobre dados reais anonimizados. Espera-se também reduzir a consulta perdida por incompatibilidade de perfil, hoje sem medição, e dar à coordenação de regulação um instrumento de acompanhamento que hoje não existe. Para os estudantes, o resultado é experiência documentada de trabalho com parceiro institucional e dado sensível, além de artefato demonstrável de portfólio.',
    'Beneficiários diretos: pacientes encaminhados pela regulação do Hospital das Clínicas a partir de 42 municípios do interior de Pernambuco, e os 14 profissionais da equipe de regulação. Beneficiários indiretos: a rede municipal de saúde dos municípios de origem, que hoje reencaminha pacientes que voltaram sem atendimento, e os 60 estudantes matriculados na disciplina, que cumprem carga horária de extensão em contexto real.',
  ],
  nase: [
    'Fila à vista: registro consolidado de atendimentos no NASE',
    'O projeto consolida em base única os registros de atendimento do Núcleo de Atenção à Saúde do Estudante, hoje dispersos em três planilhas mantidas por profissionais diferentes, e entrega à equipe a visão da fila real por tempo de espera.',
    'O NASE registra atendimento em três planilhas separadas, uma por profissional. A equipe não sabe quantos estudantes estão esperando nem há quanto tempo, e por isso não consegue priorizar caso nem dimensionar demanda junto à administração da universidade. A ação de extensão consolida o registro e devolve ao núcleo a fila real.',
    'Objetivo geral: consolidar o registro de atendimentos do NASE em base única e tornar visível a fila de espera por tempo.\n\nObjetivos específicos:\n1. Mapear os três formatos de planilha em uso e o que cada um registra.\n2. Definir base única com tratamento adequado de dado sensível de saúde.\n3. Entregar visão da fila por tempo de espera e por profissional.',
    'Ciclos de duas semanas com reunião semanal presencial no núcleo. As primeiras semanas são de levantamento junto aos três profissionais; em seguida a equipe modela a base única e migra os dados existentes; as semanas finais são de validação com a equipe e ajuste da visão de fila.',
    'Espera-se entregar a base consolidada, a fila por tempo de espera e o fim do retrabalho de consolidação manual, hoje feito a cada reunião de equipe.',
    'Beneficiários diretos: estudantes em espera por atendimento no NASE e a equipe do núcleo. Beneficiários indiretos: os estudantes matriculados na disciplina, que cumprem carga horária de extensão em contexto real.',
  ],
  recife: [
    'Campo conectado: registro digital de ocorrências das equipes de campo do Recife',
    'O projeto entrega às equipes de campo da Prefeitura do Recife um registro digital de ocorrências que funciona sem conexão e sincroniza quando há rede, reduzindo o intervalo entre o registro na rua e a chegada da informação à coordenação.',
    'Agentes de campo preenchem formulário em papel na rua e digitam depois, quando digitam. A coordenação municipal recebe o consolidado com cerca de uma semana de atraso, o que inviabiliza resposta rápida a ocorrência que exige ação imediata.',
    'Objetivo geral: reduzir o tempo entre o registro da ocorrência em campo e a chegada da informação à coordenação municipal.\n\nObjetivos específicos:\n1. Acompanhar a rotina de campo de uma equipe para entender o registro em papel.\n2. Especificar registro digital com funcionamento offline.\n3. Entregar sincronização e visão consolidada para a coordenação.',
    'Ciclos de duas semanas com reunião mensal na secretaria executiva. O escopo exige recorte: a integração com os dois sistemas municipais fica fora do semestre e é registrada como continuidade.',
    'Espera-se informação de campo disponível no mesmo dia, contra a semana atual, e protótipo testado com agentes em campo.',
    'Beneficiários diretos: agentes de campo das seis regionais e a gestão municipal. Beneficiários indiretos: moradores atendidos pelas ocorrências registradas.',
  ],
  varzea: [
    'Mapa da água: registro comunitário de alagamentos recorrentes na Várzea',
    'O projeto transforma o registro em caderno mantido pelo Coletivo Griô desde 2023 em base georreferenciada alimentada pela própria comunidade, utilizável em ofício e audiência pública.',
    'O coletivo anota alagamento em caderno desde 2023. Sem consolidação e sem mapa, a informação não sustenta ofício, audiência pública nem cobrança junto ao poder municipal.',
    'Objetivo geral: consolidar e georreferenciar o registro comunitário de alagamentos da Várzea para embasar cobrança pública.\n\nObjetivos específicos:\n1. Digitalizar com o coletivo o registro em caderno desde 2023.\n2. Definir com as lideranças o que é um ponto de alagamento e o que se registra.\n3. Entregar mapa e registro que o próprio coletivo alimenta.',
    'Ciclos de duas semanas com reunião quinzenal na comunidade. A definição do que se registra é feita com as lideranças, não pela equipe sozinha.',
    'Espera-se registro consolidado utilizável em ofício e audiência pública, e autonomia do coletivo para seguir alimentando a base depois do semestre.',
    'Beneficiários diretos: moradores da comunidade da Várzea. Beneficiários indiretos: o coletivo como interlocutor junto ao poder municipal.',
  ],
};

const ALL_TEAMS = 'Todas as equipes';

const GENERATED_WORKLOAD: Record<string, WorkloadRow[]> = {
  hc: [
    { activity: 'Levantamento do fluxo com a equipe de regulação', hours: '8', participants: ALL_TEAMS },
    { activity: 'Modelagem da base e consolidação da fila', hours: '16', participants: 'Equipe 1' },
    { activity: 'Especificação da regra de distribuição', hours: '14', participants: 'Equipe 2' },
    { activity: 'Validação com a equipe do hospital', hours: '12', participants: ALL_TEAMS },
    { activity: 'Apresentação final ao parceiro', hours: '10', participants: ALL_TEAMS },
  ],
  nase: [
    { activity: 'Levantamento das três planilhas com a equipe', hours: '8', participants: ALL_TEAMS },
    { activity: 'Modelagem da base única de atendimento', hours: '16', participants: 'Equipe 1' },
    { activity: 'Migração dos registros existentes', hours: '14', participants: 'Equipe 2' },
    { activity: 'Validação da fila com a equipe do núcleo', hours: '12', participants: ALL_TEAMS },
    { activity: 'Apresentação final ao parceiro', hours: '10', participants: ALL_TEAMS },
  ],
  recife: [
    { activity: 'Acompanhamento da rotina de campo de uma equipe', hours: '10', participants: ALL_TEAMS },
    { activity: 'Especificação do registro digital offline', hours: '16', participants: 'Equipe 1' },
    { activity: 'Sincronização e consolidação para a coordenação', hours: '14', participants: 'Equipe 2' },
    { activity: 'Teste em campo com agentes', hours: '12', participants: ALL_TEAMS },
    { activity: 'Apresentação final ao parceiro', hours: '8', participants: ALL_TEAMS },
  ],
  varzea: [
    { activity: 'Digitalização do registro em caderno', hours: '12', participants: ALL_TEAMS },
    { activity: 'Definição do registro com as lideranças', hours: '10', participants: ALL_TEAMS },
    { activity: 'Modelagem da base georreferenciada', hours: '16', participants: 'Equipe 1' },
    { activity: 'Prototipação do mapa com moradores', hours: '14', participants: 'Equipe 2' },
    { activity: 'Entrega e capacitação do coletivo', hours: '8', participants: ALL_TEAMS },
  ],
};

export const generateSections = (demandId: string): ProposalSection[] =>
  SIGAA_STRUCTURE.map((section, index) => ({ ...section, text: GENERATED_TEXTS[demandId]?.[index] ?? '' }));

export const generateWorkload = (demandId: string): WorkloadRow[] =>
  (GENERATED_WORKLOAD[demandId] ?? []).map((row) => ({ ...row }));

export const PROPOSALS: Proposal[] = [
  {
    id: 'pr1',
    title: 'Agendamento de consultas por perfil clínico e agenda médica',
    partnerName: 'Hospital das Clínicas',
    originSummary: 'Pacientes do interior perdem consultas por falta de agendamento compatível',
    demandId: 'hc',
    disciplineId: 'ds',
    disciplineName: 'Desenvolvimento de Software',
    status: 'draft',
    archived: false,
    lastEditedOn: '21/08/2026',
    generatedAt: '21/08/2026 às 09:52',
    waitingDays: 0,
    sections: generateSections('hc'),
    workload: generateWorkload('hc'),
  },
  {
    id: 'pr2',
    title: 'Fila única de atendimento do núcleo de saúde do estudante',
    partnerName: 'NASE, Núcleo de Atenção à Saúde do Estudante',
    originSummary: 'Acompanhamento é feito em planilhas dispersas e a fila real não aparece',
    demandId: 'nase',
    disciplineId: 'ds',
    disciplineName: 'Desenvolvimento de Software',
    status: 'ready',
    archived: false,
    lastEditedOn: '18/08/2026',
    generatedAt: '18/08/2026 às 14:10',
    waitingDays: 9,
    sections: generateSections('nase'),
    workload: generateWorkload('nase'),
  },
  {
    id: 'pr3',
    title: 'Registro de ocorrências das equipes de campo',
    partnerName: 'Prefeitura do Recife',
    originSummary: 'Equipes registram ocorrências em papel e a informação demora a chegar',
    demandId: 'recife',
    disciplineId: 'es1',
    disciplineName: 'Engenharia de Software 1',
    status: 'registered',
    archived: false,
    lastEditedOn: '02/09/2026',
    generatedAt: '28/08/2026 às 16:25',
    waitingDays: 0,
    registeredOn: '02/09/2026',
    sections: generateSections('recife'),
    workload: generateWorkload('recife'),
  },
];
