import type { OrganizationRecord } from '../db';

/**
 * Organizações reais já mapeadas pelo L.E.I. A demonstração é levada à reunião
 * de piloto. Os e-mails de contato são fictícios, no domínio exemplo.org.br.
 */
export const ORGANIZATIONS: OrganizationRecord[] = [
  {
    id: 'hospital-das-clinicas',
    name: 'Hospital das Clínicas',
    type: 'Órgão público',
    location: 'Cidade Universitária, Recife',
    about:
      'Hospital universitário federal ligado à UFPE e referência de alta complexidade em Pernambuco. A central de regulação recebe encaminhamentos de 42 municípios e distribui as vagas de consulta especializada.',
    audience: 'Pacientes do SUS encaminhados de todo o estado',
    site: 'hc.ufpe.br',
    meetingCadence: 'Reunião quinzenal de 1 hora, por vídeo',
    onSiteVisit: 'Recebe a turma no hospital, com agendamento de duas semanas',
    contact: {
      focalName: 'Renata Vasconcelos',
      focalRole: 'Coordenadora do núcleo de regulação',
      email: 'renata.vasconcelos@exemplo.org.br',
      channel: 'E-mail institucional',
    },
    history: [
      {
        title: 'Triagem de encaminhamentos no ambulatório',
        semester: '2025.2',
        disciplineName: 'Desenvolvimento de Software',
        teacherName: 'Paola Accioly',
        result: 'Painel de triagem em uso pela equipe do ambulatório desde janeiro.',
      },
    ],
  },
  {
    id: 'prefeitura-do-recife',
    name: 'Prefeitura do Recife',
    type: 'Órgão público',
    location: 'Recife, seis regionais',
    about:
      'Administração municipal com equipes de campo distribuídas em seis regionais. As secretarias executivas recebem o consolidado das ocorrências com cerca de uma semana de atraso.',
    audience: '1,6 milhão de habitantes do Recife',
    site: 'recife.pe.gov.br',
    meetingCadence: 'Reunião mensal presencial na secretaria',
    onSiteVisit: 'Recebe a turma e permite acompanhar equipes em campo',
    contact: {
      focalName: 'Marcos Tenório',
      focalRole: 'Secretaria executiva de gestão',
      email: 'marcos.tenorio@exemplo.org.br',
      channel: 'E-mail institucional e telefone',
    },
    history: [
      {
        title: 'Mapeamento do fluxo de atendimento de campo',
        semester: '2025.1',
        disciplineName: 'Engenharia de Software 1',
        teacherName: 'Paola Accioly',
        result: 'Fluxo de atendimento documentado e validado com as seis regionais.',
      },
    ],
  },
  {
    id: 'nase',
    name: 'NASE',
    type: 'Unidade da UFPE',
    location: 'Campus Recife',
    about:
      'Núcleo de Atenção à Saúde do Estudante. Atende estudantes da UFPE em saúde mental e física, com três profissionais que registram atendimento em planilhas separadas.',
    audience: 'Estudantes de graduação e pós-graduação da UFPE',
    site: 'ufpe.br/nase',
    meetingCadence: 'Reunião semanal de 30 minutos, presencial no campus',
    onSiteVisit: 'Recebe a turma no núcleo, no mesmo campus',
    contact: {
      focalName: 'Ana Cláudia Souto',
      focalRole: 'Coordenadora do núcleo',
      email: 'ana.souto@exemplo.org.br',
      channel: 'E-mail institucional',
    },
    history: [],
  },
  {
    id: 'coletivo-grio',
    name: 'Coletivo Griô',
    type: 'Organização social',
    location: 'Várzea, Recife',
    about:
      'Coletivo cultural da Várzea que organiza roda de samba e aulas de percussão, e documenta os alagamentos recorrentes do bairro para embasar cobrança junto à prefeitura.',
    audience: 'Cerca de 400 famílias da Várzea',
    site: 'Atua por redes sociais',
    meetingCadence: 'Reunião quinzenal, à noite ou no fim de semana',
    onSiteVisit: 'Recebe a turma na sede do coletivo, aos sábados',
    contact: {
      focalName: 'Lúcia Ferreira',
      focalRole: 'Liderança comunitária',
      email: 'lucia.ferreira@exemplo.org.br',
      channel: 'Mensagem por aplicativo',
    },
    history: [
      {
        title: 'Registro comunitário de pontos de alagamento',
        semester: '2024.2',
        disciplineName: 'Desenvolvimento de Software',
        teacherName: 'Paola Accioly',
        result: 'Mapa comunitário mantido pelo coletivo e usado em duas audiências públicas.',
      },
    ],
  },
  {
    id: 'mesa-brasil-recife',
    name: 'Mesa Brasil Recife',
    type: 'Organização social',
    location: 'Santo Amaro, Recife',
    about:
      'Rede de doação de alimentos que recolhe excedente de mercados e distribui a 60 instituições da região metropolitana. O estoque é registrado em caderno e não é visível às instituições.',
    audience: '60 instituições e cerca de 9 mil pessoas atendidas',
    site: 'sesc-pe.com.br/mesabrasil',
    meetingCadence: 'Reunião quinzenal por vídeo',
    onSiteVisit: 'Recebe a turma no centro de distribuição',
    contact: {
      focalName: 'Cláudio Rangel',
      focalRole: 'Coordenador de logística',
      email: 'claudio.rangel@exemplo.org.br',
      channel: 'E-mail e telefone',
    },
    history: [
      {
        title: 'Painel de doações do banco de alimentos',
        semester: '2024.1',
        disciplineName: 'Desenvolvimento de Software',
        teacherName: 'Paola Accioly',
        result: 'Registro de entrada e saída de doações que substituiu o caderno.',
      },
    ],
  },
  {
    id: 'casa-de-passagem',
    name: 'Casa de Passagem',
    type: 'Organização social',
    location: 'Boa Vista, Recife',
    about:
      'Acompanha meninas e jovens em situação de rua na Boa Vista. O histórico de atendimento de cada jovem está em fichas de papel, o que dificulta a continuidade quando a equipe muda.',
    audience: 'Cerca de 150 meninas e jovens por ano',
    site: 'casadepassagem.org.br',
    meetingCadence: 'Reunião quinzenal presencial ou por vídeo',
    onSiteVisit: 'Recebe a turma, com orientação prévia sobre sigilo',
    contact: {
      focalName: 'Sônia Maranhão',
      focalRole: 'Coordenadora pedagógica',
      email: 'sonia.maranhao@exemplo.org.br',
      channel: 'E-mail',
    },
    history: [],
  },
];

