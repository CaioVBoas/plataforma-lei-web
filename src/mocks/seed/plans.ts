import type { PlanSection, WorkloadRow } from '@/domain/types';

/*
 * Plano gerado a partir da demanda. Na plataforma real ele sai de um modelo de
 * linguagem alimentado pela demanda e pela disciplina; aqui está pronto para a
 * demonstração. As seções seguem o cadastro de ação de extensão do SIGAA.
 */

/** Estrutura das seções do cadastro de ação de extensão no SIGAA, com os limites de cada campo. */
const SIGAA_STRUCTURE: Omit<PlanSection, 'text'>[] = [
  { title: 'Título do projeto', limit: 150 },
  { title: 'Resumo', limit: 1500 },
  { title: 'Justificativa', limit: 2000 },
  { title: 'Objetivo geral e objetivos específicos', limit: 1500 },
  { title: 'Metodologia', limit: 2000 },
  { title: 'Resultados esperados', limit: 1200 },
  { title: 'Público beneficiado', limit: 800 },
];

/** Texto gerado a partir da demanda e da ementa, na ordem de SIGAA_STRUCTURE. */
const GENERATED_TEXTS: Record<string, string[]> = {
  mesa: [
    'Estoque à vista: doações do banco de alimentos da Mesa Brasil Recife',
    'O projeto leva para uma aplicação web o estoque de doações da Mesa Brasil Recife, hoje anotado em caderno, e abre às 60 instituições atendidas a visão do que está disponível para retirada, com alerta de perecíveis perto do vencimento.',
    'As instituições só descobrem o que há no estoque quando chegam ao centro de distribuição, e parte dos perecíveis vence antes de ser retirada. O projeto continua o painel de doações entregue pela disciplina em 2024.1 e fecha o ciclo entre entrada, estoque e retirada.',
    'Objetivo geral: tornar visível às instituições atendidas o estoque de doações da Mesa Brasil Recife.\n\nObjetivos específicos:\n1. Levantar o fluxo de entrada e saída de doações com a logística.\n2. Modelar o estoque em base única, com validade dos perecíveis.\n3. Publicar a vitrine de estoque para as instituições.\n4. Entregar alerta de perecíveis perto do vencimento.',
    'Ciclos de duas semanas com reunião quinzenal por vídeo e uma visita mensal ao centro de distribuição. Duas equipes trabalham em recortes independentes: modelagem do estoque e vitrine para as instituições.',
    'Espera-se aplicação web em uso pela equipe de logística, vitrine aberta às instituições cadastradas e redução do desperdício de perecíveis.',
    'Beneficiários diretos: 60 instituições atendidas e a equipe de logística. Beneficiários indiretos: cerca de 9 mil pessoas atendidas pelas instituições e os estudantes da disciplina.',
  ],
  casa: [
    'Histórico que acompanha: registro de atendimento das jovens da Casa de Passagem',
    'O projeto substitui as fichas de papel da Casa de Passagem por um registro contínuo de atendimento, com acesso por perfil e regras de sigilo definidas com a equipe pedagógica.',
    'Quando uma educadora sai, o histórico de acompanhamento de cada jovem se perde com a ficha de papel. A ação de extensão garante continuidade ao acompanhamento sem expor dado sensível de menores.',
    'Objetivo geral: dar continuidade ao histórico de acompanhamento das jovens atendidas pela Casa de Passagem.\n\nObjetivos específicos:\n1. Levantar com a equipe pedagógica o que o histórico precisa registrar.\n2. Definir regras de sigilo e de acesso antes de qualquer dado entrar.\n3. Entregar a prova de conceito do registro de atendimento.',
    'Ciclos de duas semanas com reunião quinzenal presencial na sede. Nenhum dado real sai da sede; o desenvolvimento usa dados fictícios até a validação final.',
    'Espera-se prova de conceito validada pela equipe pedagógica e regras de sigilo documentadas para uso futuro.',
    'Beneficiários diretos: cerca de 150 meninas e jovens acompanhadas por ano e a equipe pedagógica. Beneficiários indiretos: os estudantes da disciplina.',
  ],
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
  mesa: [
    { activity: 'Levantamento do fluxo com a logística', hours: 8, participants: ALL_TEAMS },
    { activity: 'Modelagem do estoque com validade', hours: 18, participants: 'Equipe 1' },
    { activity: 'Vitrine de estoque para as instituições', hours: 16, participants: 'Equipe 2' },
    { activity: 'Validação com instituições atendidas', hours: 10, participants: ALL_TEAMS },
    { activity: 'Apresentação final ao parceiro', hours: 8, participants: ALL_TEAMS },
  ],
  casa: [
    { activity: 'Levantamento com a equipe pedagógica', hours: 10, participants: ALL_TEAMS },
    { activity: 'Regras de sigilo e acesso', hours: 10, participants: 'Equipe 1' },
    { activity: 'Registro de atendimento', hours: 20, participants: 'Equipe 2' },
    { activity: 'Validação com a coordenação', hours: 12, participants: ALL_TEAMS },
    { activity: 'Apresentação final ao parceiro', hours: 8, participants: ALL_TEAMS },
  ],
  hc: [
    { activity: 'Levantamento do fluxo com a equipe de regulação', hours: 8, participants: ALL_TEAMS },
    { activity: 'Modelagem da base e consolidação da fila', hours: 16, participants: 'Equipe 1' },
    { activity: 'Especificação da regra de distribuição', hours: 14, participants: 'Equipe 2' },
    { activity: 'Validação com a equipe do hospital', hours: 12, participants: ALL_TEAMS },
    { activity: 'Apresentação final ao parceiro', hours: 10, participants: ALL_TEAMS },
  ],
  nase: [
    { activity: 'Levantamento das três planilhas com a equipe', hours: 8, participants: ALL_TEAMS },
    { activity: 'Modelagem da base única de atendimento', hours: 16, participants: 'Equipe 1' },
    { activity: 'Migração dos registros existentes', hours: 14, participants: 'Equipe 2' },
    { activity: 'Validação da fila com a equipe do núcleo', hours: 12, participants: ALL_TEAMS },
    { activity: 'Apresentação final ao parceiro', hours: 10, participants: ALL_TEAMS },
  ],
  recife: [
    { activity: 'Acompanhamento da rotina de campo de uma equipe', hours: 10, participants: ALL_TEAMS },
    { activity: 'Especificação do registro digital offline', hours: 16, participants: 'Equipe 1' },
    { activity: 'Sincronização e consolidação para a coordenação', hours: 14, participants: 'Equipe 2' },
    { activity: 'Teste em campo com agentes', hours: 12, participants: ALL_TEAMS },
    { activity: 'Apresentação final ao parceiro', hours: 8, participants: ALL_TEAMS },
  ],
  varzea: [
    { activity: 'Digitalização do registro em caderno', hours: 12, participants: ALL_TEAMS },
    { activity: 'Definição do registro com as lideranças', hours: 10, participants: ALL_TEAMS },
    { activity: 'Modelagem da base georreferenciada', hours: 16, participants: 'Equipe 1' },
    { activity: 'Prototipação do mapa com moradores', hours: 14, participants: 'Equipe 2' },
    { activity: 'Entrega e capacitação do coletivo', hours: 8, participants: ALL_TEAMS },
  ],
};

/** Plano inicial de um projeto. Demanda sem texto pronto recebe as seções vazias para o docente escrever. */
export const generatePlan = (demandId: string): PlanSection[] =>
  SIGAA_STRUCTURE.map((section, index) => ({ ...section, text: GENERATED_TEXTS[demandId]?.[index] ?? '' }));

export const generateWorkload = (demandId: string): WorkloadRow[] => (GENERATED_WORKLOAD[demandId] ?? []).map((row) => ({ ...row }));
