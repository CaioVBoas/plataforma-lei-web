import type { Discipline } from '../types';

/** Linha de dados da turma, na mesma ordem em que aparece no SIGAA. */
export const disciplineDataLine = (discipline: Discipline) =>
  [
    `Oferta ${discipline.semester}`,
    discipline.course,
    discipline.workload,
    `${discipline.students} estudantes matriculados`,
    `execução de ${discipline.executionStart} a ${discipline.executionEnd}`,
    `nível ${discipline.level.toLowerCase()}`,
  ].join(' · ');

export const freeSlots = (discipline: Discipline) => Math.max(0, discipline.projectCapacity - discipline.linkedProjects);
