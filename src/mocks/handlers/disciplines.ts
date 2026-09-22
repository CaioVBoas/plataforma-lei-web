import type { Discipline, DisciplineRecord, DisciplineUpdate, NewDisciplinePayload } from '@/features/disciplines/types';
import type { PracticeChange } from '@/types/practice';
import { db, findOrThrow } from '../db';
import { DISCIPLINE_CATALOG } from '../seed/disciplines';
import { applyPracticeChange } from './practice-rules';

/** Abaixo disso a demanda não é recomendada (faixas do termômetro no Design System). */
const MIN_RECOMMENDED_MATCH = 50;

const findRecord = (id: string) => findOrThrow(db.disciplines, id, 'Disciplina');

/** Contadores derivados das demandas e projetos, para nunca divergirem das outras telas. */
const withCounters = (discipline: DisciplineRecord): Discipline => ({
  ...discipline,
  linkedProjects: db.projects.filter((project) => project.stage === 'running' && project.disciplineName === discipline.name).length,
  compatibleDemands: discipline.paused
    ? 0
    : db.demands.filter(
        (demand) =>
          (demand.status === 'available' || demand.status === 'reserved-by-me') &&
          (demand.matchByDiscipline[discipline.id] ?? 0) >= MIN_RECOMMENDED_MATCH,
      ).length,
});

export const listDisciplines = (): Discipline[] => db.disciplines.map(withCounters);

export const getDiscipline = (id: string): Discipline => withCounters(findRecord(id));

export const searchCatalog = () => DISCIPLINE_CATALOG;

export const createDiscipline = (payload: NewDisciplinePayload): Discipline => {
  if (!payload.name.trim()) throw new Error('Escolha a disciplina no catálogo ou informe o nome.');
  const discipline: DisciplineRecord = {
    id: `disc-${db.disciplines.length + 1}`,
    name: payload.name.trim(),
    code: payload.code.trim() || 'IF10__',
    semester: payload.semester || '2026.2',
    course: payload.course || 'Ciência da Computação',
    workload: '60 horas',
    students: payload.students,
    executionStart: payload.executionStart.slice(0, 5),
    executionEnd: payload.executionEnd.slice(0, 5),
    level: payload.level,
    projectCapacity: payload.projectCapacity,
    syllabus: payload.syllabus,
    practice: { confirmed: [], inferred: [], excluded: [] },
    paused: !payload.acceptsDemands,
  };
  db.disciplines.push(discipline);
  return withCounters(discipline);
};

export const updateDiscipline = (id: string, update: DisciplineUpdate) => {
  Object.assign(findRecord(id), update);
};

export const changeDisciplinePractice = (id: string, change: PracticeChange) => {
  const discipline = findRecord(id);
  discipline.practice = applyPracticeChange(discipline.practice, change);
};

export const archiveDiscipline = (id: string) => {
  findRecord(id);
  db.disciplines = db.disciplines.filter((discipline) => discipline.id !== id);
};
