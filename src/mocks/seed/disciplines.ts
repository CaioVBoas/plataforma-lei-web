import type { CatalogEntry, DisciplineRecord } from '@/features/disciplines/types';

const CATALOG_ORIGIN = 'porque consta no catálogo de disciplinas do CIn para esta disciplina';

export const DISCIPLINES: DisciplineRecord[] = [
  {
    id: 'ds',
    name: 'Desenvolvimento de Software',
    code: 'IF1006',
    semester: '2026.2',
    course: 'Ciência da Computação e Engenharia da Computação',
    workload: '60 horas',
    students: 60,
    executionStart: '03/08',
    executionEnd: '04/12',
    level: 'Intermediário',
    projectCapacity: 3,
    syllabus:
      'Processos de desenvolvimento de software, levantamento de requisitos com usuário real, modelagem de dados relacional, versionamento e revisão de código. A turma trabalha em equipes de cinco e entrega um sistema funcional ao fim do semestre, com validação junto a quem vai usar.',
    practice: {
      confirmed: ['Engenharia de software', 'Banco de dados', 'Trabalho em equipe'],
      inferred: [{ name: 'Integração de sistemas', origin: 'porque a ementa cita versionamento e entrega de sistema funcional' }],
      excluded: ['Georreferenciamento'],
    },
    paused: false,
  },
  {
    id: 'es1',
    name: 'Engenharia de Software 1',
    code: 'IF1007',
    semester: '2026.2',
    course: 'Engenharia de Software',
    workload: '60 horas',
    students: 42,
    executionStart: '03/08',
    executionEnd: '04/12',
    level: 'Iniciante',
    projectCapacity: 2,
    syllabus: '',
    practice: {
      confirmed: ['Levantamento de requisitos'],
      inferred: [
        { name: 'Modelagem de processos', origin: CATALOG_ORIGIN },
        { name: 'Testes automatizados', origin: CATALOG_ORIGIN },
      ],
      excluded: [],
    },
    paused: false,
  },
  {
    id: 'ds-2026-1',
    name: 'Desenvolvimento de Software',
    code: 'IF1006',
    semester: '2026.1',
    course: 'Ciência da Computação',
    workload: '60 horas',
    students: 58,
    executionStart: '04/03',
    executionEnd: '12/07',
    level: 'Intermediário',
    projectCapacity: 3,
    syllabus: '',
    practice: { confirmed: [], inferred: [], excluded: [] },
    paused: false,
  },
];

export const DISCIPLINE_CATALOG: CatalogEntry[] = [
  { name: 'Interação Humano-Computador', code: 'IF1010' },
  { name: 'Infraestrutura de Software', code: 'IF1004' },
  { name: 'Projetos de Software', code: 'IF1015' },
];
