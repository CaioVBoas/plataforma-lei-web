import { useMemo } from 'react';
import { isOverdue, nextMilestone, projectStage, type ProjectStage } from '@/domain/projectLifecycle';
import type { IsoDate, Milestone, Project } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useProjects } from '../shared/hooks/useProjects';

export interface ProjectListItem {
  project: Project;
  stage: ProjectStage;
  /** Próxima etapa pendente; ausente quando o projeto já foi encerrado. */
  next?: Milestone;
  overdue: boolean;
  /** A data que importa na linha: o prazo da próxima etapa ou o dia do encerramento. */
  date?: IsoDate;
}

const STAGE_ORDER: Record<ProjectStage, number> = { planning: 0, running: 1, done: 2 };

/** Os projetos com o estado calculado das etapas, na ordem em que passam por eles. */
export const useProjectsList = () => {
  const projectsQuery = useProjects();
  const calendarQuery = useCalendar();
  const projects = projectsQuery.data;
  const today = calendarQuery.data?.today;

  const items = useMemo<ProjectListItem[]>(() => {
    if (!projects || !today) return [];
    return projects
      .map((project) => {
        const next = nextMilestone(project.milestones);
        const closing = project.milestones.find((milestone) => milestone.id === 'closing');
        return {
          project,
          stage: projectStage(project.milestones),
          next,
          overdue: next ? isOverdue(next, today) : false,
          date: next ? next.dueAt : closing?.doneAt,
        };
      })
      .sort((a, b) => STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage] || (a.stage === 'done' ? -1 : 1) * (a.date ?? '').localeCompare(b.date ?? ''));
  }, [projects, today]);

  return {
    items,
    today,
    isPending: projectsQuery.isPending || calendarQuery.isPending,
    error: projectsQuery.error ?? calendarQuery.error,
    refetch: () => Promise.all([projectsQuery.refetch(), calendarQuery.refetch()]),
  };
};
