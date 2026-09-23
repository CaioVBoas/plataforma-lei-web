import { freeSlots } from '@/domain/disciplineRules';
import { pluralize } from '@/utils/format';
import type { DisciplineWithUsage } from '../types';

/** "IF1006 · 60 estudantes · equipes de 5" */
export const disciplineMeta = (discipline: DisciplineWithUsage) =>
  [discipline.code, pluralize(discipline.students, 'estudante', 'estudantes'), `equipes de ${discipline.teamSize}`].filter(Boolean).join(' · ');

/** "2 vagas livres", "1 vaga livre", "Sem vaga" */
export const slotsLabel = (discipline: DisciplineWithUsage) => {
  const free = freeSlots(discipline);
  return free === 0 ? 'Sem vaga' : pluralize(free, 'vaga livre', 'vagas livres');
};
