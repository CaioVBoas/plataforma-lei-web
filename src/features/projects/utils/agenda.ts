import { daysBetween } from '@/domain/calendar';
import { isOverdue, nextMilestone } from '@/domain/project-lifecycle';
import type { IsoDate, Milestone, Project } from '@/domain/types';

export interface AgendaItem {
  project: Project;
  milestone: Milestone;
  overdue: boolean;
  daysLeft: number;
}

/** Janela em que um prazo passa a pedir atenção no Início. */
const SOON_DAYS = 14;

/** A próxima etapa de cada projeto em curso, do prazo mais apertado para o mais folgado. */
export const buildAgenda = (projects: Project[], today: IsoDate): AgendaItem[] =>
  projects
    .flatMap((project) => {
      const milestone = nextMilestone(project.milestones);
      if (!milestone) return [];
      return [{ project, milestone, overdue: isOverdue(milestone, today), daysLeft: daysBetween(today, milestone.dueAt) }];
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

/** O que precisa de ação agora: atrasado ou vencendo dentro da janela. */
export const needsAttention = (item: AgendaItem) => item.overdue || item.daysLeft <= SOON_DAYS;
