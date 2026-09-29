import type { CourseLevel, Demand, Discipline } from './types';

/**
 * A compatibilidade é contada, não estimada (regra 9 do docs/fluxos.md):
 * a disciplina combina com a demanda quando trabalha pelo menos metade das
 * competências que a demanda pede.
 */
const MIN_COVERAGE = 0.5;

const LEVEL_ORDER: Record<CourseLevel, number> = { intro: 0, intermediate: 1, advanced: 2 };

/** RN-03: a demanda não pode pedir mais do que a altura do curso em que a turma está. */
export const isAboveLevel = (demand: Pick<Demand, 'level'>, discipline: Pick<Discipline, 'level'>) =>
  LEVEL_ORDER[demand.level] > LEVEL_ORDER[discipline.level];

export interface DisciplineMatch<D extends Discipline = Discipline> {
  discipline: D;
  covered: string[];
  missing: string[];
  /** A turma cobre as competências, mas a demanda pede mais do que a altura do curso. */
  aboveLevel: boolean;
  fits: boolean;
}

const normalize = (skill: string) => skill.trim().toLocaleLowerCase('pt-BR');

export const matchDiscipline = <D extends Discipline>(demand: Pick<Demand, 'skills' | 'level'>, discipline: D): DisciplineMatch<D> => {
  const taught = new Set(discipline.skills.map(normalize));
  const covered = demand.skills.filter((skill) => taught.has(normalize(skill)));
  const missing = demand.skills.filter((skill) => !taught.has(normalize(skill)));
  const coversEnough = demand.skills.length > 0 && covered.length / demand.skills.length >= MIN_COVERAGE;
  const aboveLevel = isAboveLevel(demand, discipline);
  return { discipline, covered, missing, aboveLevel, fits: coversEnough && !aboveLevel };
};

/** As que combinam primeiro, depois da que mais cobre para a que menos cobre. Em empate, mantém a ordem das disciplinas. */
export const rankDisciplines = <D extends Discipline>(demand: Pick<Demand, 'skills' | 'level'>, disciplines: D[]) =>
  disciplines
    .map((discipline) => matchDiscipline(demand, discipline))
    .sort((a, b) => Number(b.fits) - Number(a.fits) || b.covered.length - a.covered.length);
