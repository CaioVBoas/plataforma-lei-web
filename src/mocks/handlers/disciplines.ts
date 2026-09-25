import { occupiesSlot } from '@/domain/projectLifecycle';
import type { Discipline } from '@/domain/types';
import type { DisciplineInput, DisciplineWithUsage } from '@/features/disciplines/types';
import { normalizeText } from '@/utils/format';
import { db, findOrThrow, RuleError } from '../db';
import { SKILL_CATALOG } from '../seed/disciplines';

const NOT_FOUND = 'Disciplina não encontrada.';

export const withUsage = (discipline: Discipline): DisciplineWithUsage => ({
  ...discipline,
  activeProjects: db.projects.filter((project) => project.disciplineId === discipline.id && occupiesSlot(project)).length,
  isCurrent: discipline.semester === db.calendar.id,
});

export const listDisciplines = (): DisciplineWithUsage[] => db.disciplines.map(withUsage);

export const getDiscipline = (id: string) => withUsage(findOrThrow(db.disciplines, id, NOT_FOUND));

const validate = (input: DisciplineInput) => {
  if (!input.name.trim()) throw new RuleError('Informe o nome da disciplina.');
  if (input.students < 1) throw new RuleError('A turma precisa ter ao menos um estudante.');
  if (input.teamSize < 1 || input.teamSize > input.students) throw new RuleError('O tamanho da equipe precisa caber na turma.');
  if (input.projectSlots < 1) throw new RuleError('A disciplina precisa comportar ao menos um projeto.');
};

const slugOf = (name: string) =>
  normalizeText(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const createDiscipline = (input: DisciplineInput): DisciplineWithUsage => {
  validate(input);
  const discipline: Discipline = { ...input, id: `${slugOf(input.name)}-${Date.now()}`, semester: db.calendar.id, coTeachers: [] };
  db.disciplines.unshift(discipline);
  return withUsage(discipline);
};

export const updateDiscipline = (id: string, input: DisciplineInput): DisciplineWithUsage => {
  const discipline = findOrThrow(db.disciplines, id, NOT_FOUND);
  validate(input);
  const active = withUsage(discipline).activeProjects;
  if (input.projectSlots < active) {
    throw new RuleError(`A disciplina já tem ${active} projetos em curso. As vagas não podem ficar abaixo disso.`);
  }
  Object.assign(discipline, input);
  return withUsage(discipline);
};

export const removeDiscipline = (id: string) => {
  findOrThrow(db.disciplines, id, NOT_FOUND);
  if (db.projects.some((project) => project.disciplineId === id)) {
    throw new RuleError('Esta disciplina tem projetos. Ela fica guardada com o histórico deles.');
  }
  db.disciplines = db.disciplines.filter((discipline) => discipline.id !== id);
};

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

/** Quem divide a disciplina entra pelo e-mail institucional e passa a ver os projetos dela. */
export const inviteCoTeacher = (id: string, email: string): DisciplineWithUsage => {
  const discipline = findOrThrow(db.disciplines, id, NOT_FOUND);
  const normalized = email.trim().toLowerCase();
  if (!INSTITUTIONAL_EMAIL.test(normalized)) throw new RuleError('Use o e-mail @ufpe.br ou @cin.ufpe.br do colega.');
  if (normalized === db.account.email) throw new RuleError('Você já é docente desta disciplina.');
  if (discipline.coTeachers.some((teacher) => teacher.email === normalized)) throw new RuleError('Este colega já está na disciplina.');
  discipline.coTeachers.push({ email: normalized });
  return withUsage(discipline);
};

export const removeCoTeacher = (id: string, email: string): DisciplineWithUsage => {
  const discipline = findOrThrow(db.disciplines, id, NOT_FOUND);
  discipline.coTeachers = discipline.coTeachers.filter((teacher) => teacher.email !== email);
  return withUsage(discipline);
};

export const listSkillCatalog = () => SKILL_CATALOG;
