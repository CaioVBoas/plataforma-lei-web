import type { Discipline, DisciplineUpdate, NewDisciplinePayload } from '@/features/disciplines/types';
import type { PracticeChange } from '@/types/practice';
import { db, findOrThrow } from '../db';
import { DISCIPLINE_CATALOG } from '../seed/disciplines';
import { applyPracticeChange } from './practice-rules';

const NEXT_SEMESTER = '2027.1';

const findDiscipline = (id: string) => findOrThrow(db.disciplines, id, 'Disciplina');

export const listDisciplines = (): Discipline[] => db.disciplines;

export const getDiscipline = (id: string): Discipline => findDiscipline(id);

export const searchCatalog = () => DISCIPLINE_CATALOG;

export const createDiscipline = (payload: NewDisciplinePayload): Discipline => {
  if (!payload.name.trim()) throw new Error('Escolha a disciplina no catálogo ou informe o nome.');
  const discipline: Discipline = {
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
    linkedProjects: 0,
    projectCapacity: payload.projectCapacity,
    compatibleDemands: 0,
    syllabus: payload.syllabus,
    practice: { confirmed: [], inferred: [], excluded: [] },
    paused: !payload.acceptsDemands,
  };
  db.disciplines.push(discipline);
  return discipline;
};

export const updateDiscipline = (id: string, update: DisciplineUpdate) => {
  Object.assign(findDiscipline(id), update);
};

export const changeDisciplinePractice = (id: string, change: PracticeChange) => {
  const discipline = findDiscipline(id);
  discipline.practice = applyPracticeChange(discipline.practice, change);
};

export const duplicateDiscipline = (id: string) => {
  const source = findDiscipline(id);
  db.disciplines.push({ ...structuredClone(source), id: `${id}-${NEXT_SEMESTER}`, semester: NEXT_SEMESTER, linkedProjects: 0 });
};

export const archiveDiscipline = (id: string) => {
  findDiscipline(id);
  db.disciplines = db.disciplines.filter((discipline) => discipline.id !== id);
};
