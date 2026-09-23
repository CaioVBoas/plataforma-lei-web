import type { Demand, Discipline } from './types';

/**
 * A compatibilidade é contada, não estimada (regra 9 do docs/fluxos.md):
 * a disciplina combina com a demanda quando trabalha pelo menos metade das
 * competências que a demanda pede.
 */
const MIN_COVERAGE = 0.5;

export interface DisciplineMatch<D extends Discipline = Discipline> {
  discipline: D;
  covered: string[];
  missing: string[];
  fits: boolean;
}

const normalize = (skill: string) => skill.trim().toLocaleLowerCase('pt-BR');

export const matchDiscipline = <D extends Discipline>(demand: Pick<Demand, 'skills'>, discipline: D): DisciplineMatch<D> => {
  const taught = new Set(discipline.skills.map(normalize));
  const covered = demand.skills.filter((skill) => taught.has(normalize(skill)));
  const missing = demand.skills.filter((skill) => !taught.has(normalize(skill)));
  const fits = demand.skills.length > 0 && covered.length / demand.skills.length >= MIN_COVERAGE;
  return { discipline, covered, missing, fits };
};

/** Da que mais cobre para a que menos cobre. Em empate, mantém a ordem das disciplinas. */
export const rankDisciplines = <D extends Discipline>(demand: Pick<Demand, 'skills'>, disciplines: D[]) =>
  disciplines.map((discipline) => matchDiscipline(demand, discipline)).sort((a, b) => b.covered.length - a.covered.length);
