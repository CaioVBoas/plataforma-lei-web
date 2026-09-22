import type { NewLogEntryPayload, Project } from '@/features/projects/types';
import { db, findOrThrow } from '../db';
import { CURRENT_USER } from '../seed/profile';
import { DEMO_TODAY } from '../seed/semester';

const findProject = (id: string) => findOrThrow(db.projects, id, 'Projeto');

export const listProjects = (): Project[] => db.projects;

export const getProject = (id: string): Project => findProject(id);

/** Marca a semana corrente do cronograma como registrada; o parceiro é notificado. */
export const logCurrentWeek = (id: string) => {
  const project = findProject(id);
  const currentWeek = Math.max(0, project.elapsedWeeks - 1);
  project.weeklyLog = project.weeklyLog.map((logged, week) => (week === currentWeek ? true : logged));
  project.lastUpdate = `Última atualização por você, em ${DEMO_TODAY.slice(0, 5)}`;
};

export const addLogEntry = ({ projectId, kind, text }: NewLogEntryPayload) => {
  if (!text.trim()) throw new Error('Escreva o que a equipe fez antes de registrar.');
  const project = findProject(projectId);
  project.detail.log.unshift({ author: CURRENT_USER.name, kind, date: DEMO_TODAY, text: text.trim(), attachments: [] });
  logCurrentWeek(projectId);
};

export const prepareReport = (id: string) => {
  const { completion } = findProject(id);
  if (completion) completion.report = 'sent';
};

export const publishOnShowcase = (id: string) => {
  const { completion } = findProject(id);
  if (completion) completion.publishedOnShowcase = true;
};
