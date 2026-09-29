import { freeSlots } from '@/domain/disciplineRules';
import type { CourseLevel } from '@/domain/types';
import { pluralize } from '@/utils/format';
import type { DisciplineWithUsage } from '../types';

/** "2 vagas livres", "1 vaga livre", "Sem vaga" */
export const slotsLabel = (discipline: DisciplineWithUsage) => {
  const free = freeSlots(discipline);
  return free === 0 ? 'Sem vaga' : pluralize(free, 'vaga livre', 'vagas livres');
};

/** "60 estudantes em equipes de 5 · meio do curso". O código fica de fora porque é a âncora da lista. */
export const disciplineFacts = (discipline: DisciplineWithUsage) =>
  `${pluralize(discipline.students, 'estudante', 'estudantes')} em equipes de ${discipline.teamSize} · ${LEVEL_COPY[discipline.level].label.toLowerCase()}`;

/** A altura do curso em palavras de sala de aula, com o período para não haver dúvida. */
export const LEVEL_COPY: Record<CourseLevel, { label: string; periods: string }> = {
  intro: { label: 'Início do curso', periods: '1º ao 3º período' },
  intermediate: { label: 'Meio do curso', periods: '4º ao 6º período' },
  advanced: { label: 'Fim do curso', periods: '7º período em diante' },
};
