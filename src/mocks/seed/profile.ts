import type { CurrentUser } from '@/features/auth/types';
import type { Account, PracticeProfile } from '@/features/profile/types';

export const CURRENT_USER: CurrentUser = {
  name: 'Paola Accioly',
  email: 'paola.accioly@ufpe.br',
  affiliation: 'Centro de Informática, UFPE',
  roleLabel: 'Docente, CIn',
};

export const ACCOUNT: Account = {
  name: CURRENT_USER.name,
  department: CURRENT_USER.affiliation,
  email: CURRENT_USER.email,
  phone: '',
  preferredChannel: 'E-mail institucional',
  publicProfileLink: 'aperta-o-plei.cin.ufpe.br/docente/paola-accioly',
  projectsPerSemester: 3,
  receivingPaused: false,
  onboardingCompleted: false,
  privacy: {
    partnersSeeContact: true,
    partnersSeeProjects: true,
    studentsSeePractice: true,
    studentsSeeEmail: false,
  },
  currentDevice: 'MacBook Pro · Chrome · Recife',
  lastAccess: 'Hoje às 09:41',
};

export const PRACTICE_PROFILE: PracticeProfile = {
  confirmed: ['Engenharia de software', 'Banco de dados', 'Trabalho em equipe', 'Levantamento de requisitos'],
  inferred: [
    { name: 'Modelagem de processos', origin: 'porque você cadastrou a ementa de Desenvolvimento de Software' },
    { name: 'Visualização de dados', origin: 'porque você registrou aqui o projeto de triagem de 2025.1' },
    { name: 'Testes automatizados', origin: 'porque consta no catálogo de disciplinas do CIn para Engenharia de Software 1' },
  ],
  excluded: ['Georreferenciamento', 'Sincronização offline'],
  themes: {
    'Saúde pública': 'interest',
    'Gestão pública': 'interest',
    Educação: 'interest',
    'Inclusão e acessibilidade': 'interest',
    Cultura: 'excluded',
  },
  pastProjects: [
    { title: 'Triagem de encaminhamentos no HC', year: '2025.1', partnerName: 'Hospital das Clínicas', competencies: ['Engenharia de software', 'Banco de dados'] },
    { title: 'Mapeamento de fluxo de atendimento', year: '2025.2', partnerName: 'Prefeitura do Recife', competencies: ['Análise de processos', 'Visualização de dados'] },
  ],
  corrections: [
    { text: 'Confirmou Modelagem de processos como prática sua', date: '21/08/2026' },
    { text: 'Descartou Testes automatizados da leitura automática', date: '19/08/2026' },
    { text: 'Marcou Georreferenciamento como não conduzo', date: '12/08/2026' },
    { text: 'Corrigiu o par de Interação humano computador na demanda do HC', date: '08/08/2026' },
    { text: 'Registrou o projeto de mapeamento de fluxo de 2025.2', date: '02/08/2026' },
  ],
};
