import type { Practice } from '@/types/practice';

export type DisciplineLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface Discipline {
  id: string;
  name: string;
  code: string;
  semester: string;
  course: string;
  workload: string;
  students: number;
  executionStart: string;
  executionEnd: string;
  level: DisciplineLevel;
  linkedProjects: number;
  projectCapacity: number;
  compatibleDemands: number;
  syllabus: string;
  practice: Practice;
  paused: boolean;
}

/** Como a disciplina é guardada; vínculos e demandas compatíveis são calculados na leitura. */
export type DisciplineRecord = Omit<Discipline, 'linkedProjects' | 'compatibleDemands'>;

export type DisciplineUpdate = Partial<Pick<Discipline, 'syllabus' | 'projectCapacity' | 'paused'>>;

export interface CatalogEntry {
  name: string;
  code: string;
}

export interface NewDisciplinePayload {
  name: string;
  code: string;
  semester: string;
  course: string;
  students: number;
  executionStart: string;
  executionEnd: string;
  level: DisciplineLevel;
  syllabus: string;
  acceptsDemands: boolean;
  projectCapacity: number;
}
