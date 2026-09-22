import type { Project, ReportStatus } from '../types';

/** Três semanas seguidas sem registro de andamento é o sinal de que a equipe precisa de contato. */
export const SILENCE_ALERT_WEEKS = 3;

/** Semanas consecutivas sem registro, contando da semana corrente para trás. */
export const silentWeeks = (project: Project) => {
  let count = 0;
  for (let week = project.elapsedWeeks - 1; week >= 0 && !project.weeklyLog[week]; week -= 1) count += 1;
  return count;
};

export const REPORT_LABEL: Record<ReportStatus, string> = {
  pending: 'Relatório pendente',
  sent: 'Relatório enviado',
  approved: 'Aprovado pela PROExC',
};

export const needsAttention = (project: Project) =>
  project.completion ? project.completion.report === 'pending' : silentWeeks(project) >= SILENCE_ALERT_WEEKS;

export const healthLabel = (project: Project) => {
  if (project.completion) return REPORT_LABEL[project.completion.report];
  const silence = silentWeeks(project);
  if (silence >= SILENCE_ALERT_WEEKS) return `Sem registro há ${silence} semanas`;
  return silence >= 1 ? 'Irregular' : 'Em dia';
};

export type ProjectNextAction = 'log-week' | 'prepare-report' | 'publish';

/** Próxima ação que destrava o projeto; concluído e publicado não pede mais nada. */
export const nextActionOf = (project: Project): ProjectNextAction | null => {
  if (!project.completion) return 'log-week';
  if (project.completion.report === 'pending') return 'prepare-report';
  if (project.completion.report === 'approved' && !project.completion.publishedOnShowcase) return 'publish';
  return null;
};

export const NEXT_ACTION_LABEL: Record<ProjectNextAction, string> = {
  'log-week': 'Registrar andamento',
  'prepare-report': 'Preparar relatório',
  publish: 'Publicar na vitrine',
};
