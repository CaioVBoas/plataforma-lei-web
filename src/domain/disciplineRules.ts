import type { Discipline } from './types';

/** Quantas equipes a turma forma, arredondando para baixo. Toda turma forma ao menos uma. */
export const maxTeams = (discipline: Pick<Discipline, 'students' | 'teamSize'>) =>
  Math.max(1, Math.floor(discipline.students / discipline.teamSize));

export const freeSlots = (discipline: Pick<Discipline, 'projectSlots'> & { activeProjects: number }) =>
  Math.max(0, discipline.projectSlots - discipline.activeProjects);
