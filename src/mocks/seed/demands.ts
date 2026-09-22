import type {
  Colleague,
  CompetencyReading,
  ConversationMessage,
  Demand,
  GapLine,
  MatchLine,
  PartnerReference,
} from '@/features/matchmaking/types';

/**
 * Demandas reais já mapeadas pelo L.E.I. O protótipo usa dados reais porque a
 * demonstração é levada à reunião de piloto.
 */

const competencies = (names: string[]) => names.map((name) => ({ name, confirmed: false }));

/** Compatibilidade de demonstração com a segunda disciplina, até o modelo real existir. */
const withSecondDiscipline = (percent: number) => ({ ds: percent, es1: Math.max(31, Math.round(percent * 0.62)) });

export const DEMANDS: Demand[] = [
  {
    id: 'hc',
    organizationId: 'hospital-das-clinicas',
    organizationName: 'Hospital das Clínicas',
    organizationType: 'Órgão público',
    problem: 'Pacientes do interior perdem consultas por falta de agendamento compatível com o perfil do médico',
    affectedPublic: 'pacientes do interior e equipe de regulação',
    description:
      'A regulação recebe pedidos de consulta de 42 municípios e distribui por ordem de chegada, sem cruzar o perfil do pedido com a especialidade e a agenda real do médico. O resultado é paciente que viaja e não é atendido, e vaga que fica aberta. A equipe quer ver a fila real e uma regra de distribuição que respeite perfil, agenda e distância.',
    viability: 'fits',
    viabilityNote: 'Escopo compatível com quatro meses. O parceiro já tem base de dados e ponto focal definido.',
    followUpCadence: 'Quinzenal',
    publishedDaysAgo: 6,
    hasNoInterested: false,
    status: 'available',
    competencies: competencies([
      'Engenharia de software',
      'Banco de dados',
      'Interação humano computador',
      'Análise de processos',
      'Integração de sistemas',
      'Modelagem de processos',
    ]),
    matchByDiscipline: withSecondDiscipline(84),
  },
  {
    id: 'nase',
    organizationId: 'nase',
    organizationName: 'NASE, Núcleo de Atenção à Saúde do Estudante',
    organizationType: 'Unidade da UFPE',
    problem: 'Acompanhamento de atendimentos é feito em planilhas dispersas e a equipe não enxerga a fila real',
    affectedPublic: 'estudantes em espera e equipe do núcleo',
    description:
      'A equipe registra atendimento em três planilhas diferentes, uma por profissional. Ninguém sabe quantos estudantes estão esperando nem há quanto tempo. O pedido é consolidar o registro e ver a fila por tempo de espera.',
    viability: 'fits',
    viabilityNote: 'Escopo compatível com quatro meses, desde que o cadastro de atendimento fique fora da primeira entrega.',
    followUpCadence: 'Semanal',
    publishedDaysAgo: 2,
    hasNoInterested: false,
    status: 'reserved-by-me',
    reservationDaysLeft: 3,
    competencies: competencies(['Banco de dados', 'Visualização de dados', 'Engenharia de software', 'LGPD']),
    matchByDiscipline: withSecondDiscipline(76),
  },
  {
    id: 'recife',
    organizationId: 'prefeitura-do-recife',
    organizationName: 'Prefeitura do Recife',
    organizationType: 'Órgão público',
    problem: 'Equipes de campo registram ocorrências em papel e a informação demora a chegar à coordenação',
    affectedPublic: 'agentes de campo e gestão municipal',
    description:
      'Agentes preenchem formulário em papel na rua e digitam à noite, quando digitam. A coordenação recebe o consolidado com uma semana de atraso.',
    viability: 'tight',
    viabilityNote: 'Exige recorte para caber. O escopo original prevê integração com dois sistemas municipais.',
    followUpCadence: 'Mensal',
    publishedDaysAgo: 12,
    hasNoInterested: true,
    status: 'available',
    competencies: competencies(['Desenvolvimento móvel', 'Banco de dados', 'Interação humano computador', 'Sincronização offline']),
    matchByDiscipline: withSecondDiscipline(71),
  },
  {
    id: 'varzea',
    organizationId: 'coletivo-grio',
    organizationName: 'Coletivo Griô, Várzea',
    organizationType: 'Organização social',
    problem: 'Comunidade não tem registro consolidado de alagamentos recorrentes para embasar cobrança pública',
    affectedPublic: 'moradores da comunidade',
    description:
      'O coletivo anota alagamento em caderno desde 2023. Sem consolidação e sem mapa, a informação não sustenta ofício nem audiência pública.',
    viability: 'fits',
    viabilityNote: 'Escopo compatível com quatro meses. Coleta participativa já existe em caderno.',
    followUpCadence: 'Quinzenal',
    publishedDaysAgo: 3,
    hasNoInterested: false,
    status: 'reserved-by-other',
    reservedBy: 'Prof. Luiz Morais',
    competencies: competencies(['Visualização de dados', 'Ciência de dados', 'Interação humano computador']),
    matchByDiscipline: withSecondDiscipline(63),
  },
];

interface DemandContext {
  where: string;
  since: string;
  focalName: string;
  focalRole: string;
  channel: string;
  references: PartnerReference[];
  conversation: ConversationMessage[];
}

const lei = (date: string, text: string): ConversationMessage => ({
  author: 'Kiev Gama',
  role: 'Equipe do Aperta o PLEI',
  date,
  text,
  mine: false,
});

export const DEMAND_CONTEXT: Record<string, DemandContext> = {
  hc: {
    where: 'Central de regulação do HC e 42 municípios do interior',
    since: 'Relatado pela equipe desde 2023, sem solução até hoje',
    focalName: 'Renata Vasconcelos',
    focalRole: 'Coordenadora do núcleo de regulação',
    channel: 'E-mail institucional, reunião por vídeo',
    references: [
      { name: 'SISREG, Ministério da Saúde', description: 'Sistema nacional de regulação já usado por parte da rede pública.', url: 'https://sisregiii.saude.gov.br' },
      { name: 'OpenMRS', description: 'Prontuário eletrônico de código aberto com módulo de agendamento.', url: 'https://openmrs.org' },
      { name: 'Cal.com', description: 'Agendamento de código aberto com regras de disponibilidade por perfil.', url: 'https://cal.com' },
    ],
    conversation: [
      { author: 'Renata Vasconcelos', role: 'Hospital das Clínicas', date: '18/08', mine: false, text: 'Publicamos a demanda com os dados de 2024 e 2025 já anonimizados. Podemos abrir acesso a um recorte de três meses para a turma trabalhar.' },
      lei('20/08', 'Demanda triada e liberada para o cardápio. Escopo compatível com um semestre desde que a integração com o barramento fique fora.'),
      { author: 'Renata Vasconcelos', role: 'Hospital das Clínicas', date: '22/08', mine: false, text: 'Concordo com o recorte. Nossa expectativa é ver a fila real primeiro, o resto vem depois.' },
    ],
  },
  nase: {
    where: 'Sede do NASE no campus Recife',
    since: 'Planilhas em uso desde 2022',
    focalName: 'Ana Cláudia Souto',
    focalRole: 'Coordenadora do núcleo',
    channel: 'E-mail institucional, reunião presencial',
    references: [
      { name: 'OpenMRS', description: 'Prontuário de código aberto com registro de atendimento.', url: 'https://openmrs.org' },
      { name: 'Metabase', description: 'Visualização de dados sobre base existente, sem desenvolvimento pesado.', url: 'https://www.metabase.com' },
      { name: 'Baserow', description: 'Base colaborativa que substitui planilha dispersa.', url: 'https://baserow.io' },
    ],
    conversation: [
      { author: 'Ana Cláudia Souto', role: 'NASE', date: '24/08', mine: false, text: 'As três planilhas seguem formatos diferentes. Consigo entregar as três já anonimizadas na primeira reunião.' },
      lei('25/08', 'Triada e liberada. Dado sensível de saúde exige combinar tratamento com a equipe antes do início.'),
    ],
  },
  recife: {
    where: 'Equipes de campo em seis regionais do Recife',
    since: 'Registro em papel desde sempre, digitalização nunca saiu do papel',
    focalName: 'Marcos Tenório',
    focalRole: 'Secretaria executiva de gestão',
    channel: 'E-mail institucional, reunião mensal',
    references: [
      { name: 'KoboToolbox', description: 'Coleta de dados em campo com funcionamento offline.', url: 'https://www.kobotoolbox.org' },
      { name: 'ODK', description: 'Formulários offline usados em pesquisa de campo.', url: 'https://getodk.org' },
      { name: 'ODK Central', description: 'Servidor de sincronização para coleta distribuída.', url: 'https://docs.getodk.org' },
    ],
    conversation: [
      { author: 'Marcos Tenório', role: 'Prefeitura do Recife', date: '12/08', mine: false, text: 'A prioridade é o registro em campo. A integração com os sistemas internos pode ficar para depois.' },
      lei('14/08', 'Marcada como apertada no cardápio: sem recorte não cabe em um semestre.'),
    ],
  },
  varzea: {
    where: 'Comunidade da Várzea, Recife',
    since: 'Registro em caderno desde 2023',
    focalName: 'Dona Lúcia Ferreira',
    focalRole: 'Liderança comunitária',
    channel: 'Mensagem por celular, reunião na comunidade',
    references: [
      { name: 'uMap', description: 'Mapas colaborativos sobre OpenStreetMap, sem servidor próprio.', url: 'https://umap.openstreetmap.fr' },
      { name: 'Ushahidi', description: 'Registro comunitário de ocorrências georreferenciadas.', url: 'https://www.ushahidi.com' },
      { name: 'QGIS', description: 'Análise espacial livre, útil para consolidar a série histórica.', url: 'https://qgis.org' },
    ],
    conversation: [
      { author: 'Dona Lúcia Ferreira', role: 'Coletivo Griô', date: '21/08', mine: false, text: 'Temos caderno desde 2023 com data e rua de cada alagamento. Queremos que fique com a comunidade, não só com a universidade.' },
      lei('22/08', 'Triada e liberada. Demanda de alto valor social e escopo enxuto.'),
    ],
  },
};

/** Explicação do casamento com a disciplina principal (Desenvolvimento de Software). */
export const MATCH_BASE: Record<string, { matches: MatchLine[]; gaps: GapLine[] }> = {
  hc: {
    matches: [
      { competency: 'Engenharia de software', practice: 'Projetos em equipe com entrega ao fim do semestre', source: 'da sua prática declarada' },
      { competency: 'Banco de dados', practice: 'Modelagem relacional', source: 'da ementa que você cadastrou' },
      { competency: 'Análise de processos', practice: 'Mapeamento de fluxo em parceria com a Prefeitura', source: 'de projeto que você registrou aqui' },
    ],
    gaps: [{ competency: 'Interação humano computador', reason: 'Sem par na ementa nem no seu perfil de prática.' }],
  },
  nase: {
    matches: [
      { competency: 'Banco de dados', practice: 'Modelagem relacional', source: 'da ementa que você cadastrou' },
      { competency: 'Visualização de dados', practice: 'Painéis de acompanhamento para equipe gestora', source: 'da sua prática declarada' },
      { competency: 'Engenharia de software', practice: 'Projeto de cadastro acadêmico', source: 'de projeto que você registrou aqui' },
    ],
    gaps: [{ competency: 'Tratamento de dado sensível sob LGPD', reason: 'Consta na ementa de Banco de Dados, não na disciplina vinculada.' }],
  },
  recife: {
    matches: [
      { competency: 'Desenvolvimento móvel', practice: 'Aplicações móveis em equipe', source: 'do catálogo de disciplinas do CIn' },
      { competency: 'Banco de dados', practice: 'Modelagem relacional', source: 'da ementa que você cadastrou' },
      { competency: 'Interação humano computador', practice: 'Prototipação com usuário real', source: 'da sua prática declarada' },
    ],
    gaps: [
      { competency: 'Sincronização offline', reason: 'Sem par na ementa nem no seu perfil de prática.' },
      { competency: 'Integração com sistema legado municipal', reason: 'Sem registro em projetos anteriores.' },
    ],
  },
  varzea: {
    matches: [
      { competency: 'Visualização de dados', practice: 'Painéis de acompanhamento para equipe gestora', source: 'da sua prática declarada' },
      { competency: 'Ciência de dados', practice: 'Tratamento e análise de série histórica', source: 'da ementa que você cadastrou' },
    ],
    gaps: [
      { competency: 'Georreferenciamento', reason: 'Sem par na ementa nem no seu perfil de prática.' },
      { competency: 'Interação humano computador', reason: 'Sem par na ementa nem no seu perfil de prática.' },
    ],
  },
};

type ReadingSeed = Omit<CompetencyReading, 'manualAssociations'>;

export const READINGS: Record<string, ReadingSeed> = {
  hc: {
    segments: [
      { text: 'A regulação recebe pedidos de consulta de 42 municípios e distribui por ordem de chegada, ' },
      { text: 'sem cruzar o perfil do pedido com a especialidade e a agenda real do médico', competency: 'Análise de processos', confidence: 'alta' },
      { text: '. O resultado é paciente que viaja e não é atendido, e vaga que fica aberta. A equipe quer ' },
      { text: 'ver a fila real', competency: 'Visualização de dados', confidence: 'média' },
      { text: ' e ' },
      { text: 'uma regra de distribuição que respeite perfil, agenda e distância', competency: 'Engenharia de software', confidence: 'alta' },
      { text: '. Os dados de atendimento estão ' },
      { text: 'espalhados em três bases que nunca conversaram', competency: 'Banco de dados', confidence: 'alta' },
      { text: '. Seria bom que ' },
      { text: 'a equipe conseguisse usar sem treinamento', competency: 'Interação humano computador', confidence: 'baixa' },
      { text: '.' },
    ],
    ignoredExcerpts: ['O resultado é paciente que viaja e não é atendido, e vaga que fica aberta.', 'A equipe hoje tem 14 profissionais em dois turnos.'],
  },
  nase: {
    segments: [
      { text: 'A equipe registra atendimento em ' },
      { text: 'três planilhas diferentes, uma por profissional', competency: 'Banco de dados', confidence: 'alta' },
      { text: '. Ninguém sabe ' },
      { text: 'quantos estudantes estão esperando nem há quanto tempo', competency: 'Visualização de dados', confidence: 'alta' },
      { text: '. O pedido é ' },
      { text: 'consolidar o registro', competency: 'Engenharia de software', confidence: 'média' },
      { text: ' e ver a fila por tempo de espera. Como é ' },
      { text: 'dado de saúde de estudante', competency: 'LGPD', confidence: 'baixa' },
      { text: ', precisa de cuidado.' },
    ],
    ignoredExcerpts: ['O núcleo atende também demanda espontânea, sem agendamento.', 'A sala fica no bloco anexo do campus.'],
  },
  recife: {
    segments: [
      { text: 'Agentes preenchem ' },
      { text: 'formulário em papel na rua', competency: 'Desenvolvimento móvel', confidence: 'alta' },
      { text: ' e digitam à noite, quando digitam. Boa parte da cidade ' },
      { text: 'não tem sinal estável durante a ronda', competency: 'Sincronização offline', confidence: 'média' },
      { text: '. A coordenação recebe o consolidado com ' },
      { text: 'uma semana de atraso', competency: 'Banco de dados', confidence: 'média' },
      { text: '. Os agentes ' },
      { text: 'não são pessoas de computador', competency: 'Interação humano computador', confidence: 'baixa' },
      { text: '.' },
    ],
    ignoredExcerpts: ['Cada regional tem um coordenador responsável pela conferência.', 'O formulário atual tem 22 campos.'],
  },
  varzea: {
    segments: [
      { text: 'O coletivo anota alagamento em ' },
      { text: 'caderno desde 2023', competency: 'Ciência de dados', confidence: 'média' },
      { text: ', com ' },
      { text: 'data e nome da rua', competency: 'Georreferenciamento', confidence: 'alta' },
      { text: '. Sem consolidação e sem mapa, ' },
      { text: 'a informação não sustenta ofício nem audiência pública', competency: 'Visualização de dados', confidence: 'alta' },
      { text: '. Queremos que ' },
      { text: 'a própria comunidade continue alimentando', competency: 'Interação humano computador', confidence: 'baixa' },
      { text: '.' },
    ],
    ignoredExcerpts: ['A comunidade tem cerca de 400 famílias na área alagável.', 'As reuniões do coletivo acontecem no salão da igreja.'],
  },
};

export const COMPETENCY_CATALOG = [
  'Engenharia de software', 'Banco de dados', 'Interação humano computador', 'Análise de processos',
  'Desenvolvimento móvel', 'Desenvolvimento web', 'Visualização de dados', 'Ciência de dados',
  'Integração de sistemas', 'Modelagem de processos', 'Testes automatizados', 'Levantamento de requisitos',
  'Sincronização offline', 'Infraestrutura em nuvem', 'Segurança da informação', 'LGPD',
  'Acessibilidade digital', 'Pesquisa com usuários', 'Gestão de projetos', 'Trabalho em equipe',
];

/** Reservas que já expiraram antes da sessão de demonstração começar. */
export const EXPIRED_RESERVATIONS = [
  { demandId: 'varzea', expiredOn: '14/08' },
  { demandId: 'recife', expiredOn: '09/08' },
];

export const COLLEAGUES: Colleague[] = [
  { id: 'lm', name: 'Luiz Morais', area: 'Interação humano computador' },
  { id: 'cs', name: 'Cristiano Silva', area: 'Engenharia de software, processos' },
];
