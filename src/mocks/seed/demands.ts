import type { Demand } from '@/domain/types';

/**
 * Demandas reais já triadas pelo L.E.I. As duas últimas já viraram projetos
 * da docente de demonstração, por isso estão fora do cardápio.
 */
export const DEMANDS: Demand[] = [
  {
    id: 'nase',
    organization: { id: 'nase', name: 'NASE', type: 'Unidade da UFPE' },
    title: 'Fila de atendimento do NASE',
    problem: 'A equipe registra atendimentos em três planilhas e ninguém sabe quantos estudantes estão esperando.',
    description:
      'Cada profissional do núcleo registra atendimento na própria planilha, em formatos diferentes. Ninguém sabe quantos estudantes estão esperando nem há quanto tempo, e a equipe não consegue priorizar casos nem dimensionar a demanda junto à administração da universidade. O pedido é consolidar o registro e ver a fila por tempo de espera.',
    affectedPublic: 'Estudantes em espera por atendimento e a equipe do núcleo',
    skills: ['Banco de dados', 'Visualização de dados', 'Engenharia de software', 'LGPD e privacidade'],
    scopeFit: 'fits',
    scopeNote: 'Cabe em um semestre se o cadastro de novos atendimentos ficar para uma segunda entrega.',
    meetingCadence: 'Reunião semanal de 30 minutos, no campus',
    offers: ['As três planilhas anonimizadas na primeira reunião', 'Acesso da turma ao núcleo, no mesmo campus'],
    publishedAt: '2026-08-22',
    status: 'open',
  },
  {
    id: 'hc',
    organization: { id: 'hospital-das-clinicas', name: 'Hospital das Clínicas', type: 'Órgão público' },
    title: 'Fila de consultas do interior',
    problem: 'Pacientes do interior viajam e perdem a consulta porque a fila não cruza o pedido com a agenda do médico.',
    description:
      'A central de regulação recebe pedidos de consulta de 42 municípios e distribui por ordem de chegada, sem cruzar o perfil do pedido com a especialidade e a agenda real do médico. O resultado é paciente que viaja e não é atendido, e vaga que fica aberta. A equipe quer ver a fila real e uma regra de distribuição que respeite perfil, agenda e distância.',
    affectedPublic: 'Pacientes do interior e os 14 profissionais da regulação',
    skills: ['Engenharia de software', 'Banco de dados', 'Modelagem de processos', 'Interação humano computador'],
    scopeFit: 'fits',
    scopeNote: 'Cabe em um semestre com a integração ao barramento do hospital fora do escopo.',
    meetingCadence: 'Reunião quinzenal de 1 hora, por vídeo',
    offers: ['Dados de 2024 e 2025 já anonimizados', 'Recorte de três meses da fila para a turma trabalhar', 'Visita à central de regulação'],
    publishedAt: '2026-08-18',
    status: 'open',
  },
  {
    id: 'varzea',
    organization: { id: 'coletivo-grio', name: 'Coletivo Griô', type: 'Organização social' },
    title: 'Mapa dos alagamentos da Várzea',
    problem: 'A comunidade anota os alagamentos em caderno e, sem mapa, a informação não sustenta cobrança pública.',
    description:
      'O coletivo anota cada alagamento em caderno desde 2023, com data e nome da rua. Sem consolidação e sem mapa, a informação não sustenta ofício nem audiência pública. O coletivo quer que o registro fique com a comunidade e que ela mesma continue alimentando depois do semestre.',
    affectedPublic: 'Cerca de 400 famílias da área alagável',
    skills: ['Visualização de dados', 'Ciência de dados', 'Georreferenciamento'],
    scopeFit: 'fits',
    scopeNote: 'Escopo enxuto. A coleta participativa já existe em caderno.',
    meetingCadence: 'Reunião quinzenal na comunidade, à noite ou no fim de semana',
    offers: ['Caderno de registros desde 2023', 'Encontro com moradores na sede do coletivo'],
    publishedAt: '2026-08-21',
    status: 'open',
  },
  {
    id: 'recife',
    organization: { id: 'prefeitura-do-recife', name: 'Prefeitura do Recife', type: 'Órgão público' },
    title: 'Ocorrências de campo em papel',
    problem: 'Agentes de campo registram ocorrências em papel e a coordenação só recebe a informação uma semana depois.',
    description:
      'Agentes preenchem formulário em papel na rua e digitam à noite, quando digitam. Boa parte da cidade não tem sinal estável durante a ronda. A coordenação recebe o consolidado com uma semana de atraso, o que impede resposta rápida a ocorrência urgente.',
    affectedPublic: 'Agentes de campo das seis regionais e a gestão municipal',
    skills: ['Desenvolvimento móvel', 'Banco de dados', 'Interação humano computador', 'Sincronização offline'],
    scopeFit: 'needs-cut',
    scopeNote: 'Precisa de recorte. O pedido original inclui integração com dois sistemas municipais, que não cabe no semestre.',
    meetingCadence: 'Reunião mensal presencial na secretaria',
    offers: ['Acompanhamento de uma equipe em campo', 'Formulário atual, com 22 campos'],
    publishedAt: '2026-08-12',
    status: 'open',
  },
  {
    id: 'mesa',
    organization: { id: 'mesa-brasil-recife', name: 'Mesa Brasil Recife', type: 'Organização social' },
    title: 'Estoque de doações visível',
    problem: 'As instituições só descobrem o que há no estoque de doações quando chegam para buscar.',
    description:
      'O estoque de doações é anotado em caderno no centro de distribuição. As 60 instituições atendidas só descobrem o que há disponível quando chegam para retirar, e parte dos perecíveis vence antes de ser distribuída.',
    affectedPublic: '60 instituições atendidas e a equipe de logística',
    skills: ['Banco de dados', 'Desenvolvimento web', 'Visualização de dados'],
    scopeFit: 'fits',
    scopeNote: 'Continuidade do painel de doações entregue em 2024.1.',
    meetingCadence: 'Reunião quinzenal por vídeo',
    offers: ['Caderno de entrada e saída de doações', 'Visita ao centro de distribuição'],
    publishedAt: '2026-07-10',
    status: 'in-project',
  },
  {
    id: 'casa',
    organization: { id: 'casa-de-passagem', name: 'Casa de Passagem', type: 'Organização social' },
    title: 'Histórico de atendimento das jovens',
    problem: 'O histórico de cada jovem fica em ficha de papel e se perde quando a equipe muda.',
    description:
      'Cada jovem acompanhada tem uma ficha de papel com o histórico de atendimento. Quando uma educadora sai, a próxima recomeça do zero. A equipe quer um registro contínuo, com sigilo, que qualquer pessoa autorizada consiga consultar.',
    affectedPublic: 'Cerca de 150 meninas e jovens por ano e a equipe pedagógica',
    skills: ['Levantamento de requisitos', 'Banco de dados', 'LGPD e privacidade'],
    scopeFit: 'fits',
    scopeNote: 'Cabe em um semestre com o registro de novos atendimentos como primeira entrega.',
    meetingCadence: 'Reunião quinzenal presencial ou por vídeo',
    offers: ['Modelo de ficha atual, sem dados reais', 'Orientação da equipe sobre sigilo antes da primeira visita'],
    publishedAt: '2026-08-05',
    status: 'in-project',
  },
];
