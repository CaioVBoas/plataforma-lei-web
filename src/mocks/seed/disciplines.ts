import type { Discipline } from '@/domain/types';

/** Vocabulário comum a demandas e disciplinas. Sem ele, a compatibilidade dependeria de grafia. */
export const SKILL_CATALOG = [
  'Banco de dados',
  'Ciência de dados',
  'Desenvolvimento móvel',
  'Desenvolvimento web',
  'Engenharia de software',
  'Georreferenciamento',
  'Interação humano computador',
  'Levantamento de requisitos',
  'LGPD e privacidade',
  'Modelagem de processos',
  'Sincronização offline',
  'Testes de software',
  'Visualização de dados',
];

export const DISCIPLINES: Discipline[] = [
  {
    id: 'ds',
    name: 'Desenvolvimento de Software',
    code: 'IF1006',
    semester: '2026.2',
    students: 60,
    teamSize: 5,
    projectSlots: 3,
    skills: ['Engenharia de software', 'Banco de dados', 'Desenvolvimento web', 'Levantamento de requisitos', 'Visualização de dados'],
  },
  {
    id: 'es1',
    name: 'Engenharia de Software 1',
    code: 'IF1007',
    semester: '2026.2',
    students: 42,
    teamSize: 6,
    projectSlots: 2,
    skills: ['Levantamento de requisitos', 'Modelagem de processos', 'Testes de software', 'Interação humano computador'],
  },
  // Semestres anteriores: guardam os projetos concluídos.
  {
    id: 'ds-2025-2',
    name: 'Desenvolvimento de Software',
    code: 'IF1006',
    semester: '2025.2',
    students: 58,
    teamSize: 5,
    projectSlots: 3,
    skills: ['Engenharia de software', 'Banco de dados', 'Desenvolvimento web'],
  },
  {
    id: 'es1-2025-1',
    name: 'Engenharia de Software 1',
    code: 'IF1007',
    semester: '2025.1',
    students: 40,
    teamSize: 5,
    projectSlots: 2,
    skills: ['Levantamento de requisitos', 'Modelagem de processos'],
  },
  {
    id: 'ds-2024-2',
    name: 'Desenvolvimento de Software',
    code: 'IF1006',
    semester: '2024.2',
    students: 55,
    teamSize: 5,
    projectSlots: 2,
    skills: ['Engenharia de software', 'Banco de dados', 'Visualização de dados'],
  },
];
