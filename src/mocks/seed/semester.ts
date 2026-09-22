import type { SemesterContext } from '@/features/semester/types';

export const SEMESTER_CONTEXT: SemesterContext = {
  current: '2026.2',
  nextDeadline: 'Vinculação de projetos até 12/09',
  daysLeft: 14,
  semesters: [
    { id: '2026.2', summary: '2 disciplinas, 3 projetos' },
    { id: '2026.1', summary: '1 disciplina, 2 projetos' },
    { id: '2025.2', summary: '2 disciplinas, 2 projetos' },
    { id: '2025.1', summary: '1 disciplina, nenhum projeto' },
  ],
};

/** Data de referência da demonstração, usada nos registros criados durante a sessão. */
export const DEMO_TODAY = '24/08/2026';
