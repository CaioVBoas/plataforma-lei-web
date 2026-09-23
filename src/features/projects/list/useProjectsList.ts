import { useMemo } from 'react';
import { projectStage, type ProjectStage } from '@/domain/projectLifecycle';
import type { Project } from '@/domain/types';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useProjects } from '../shared/hooks/useProjects';

const EMPTY_GROUPS = (): Record<ProjectStage, Project[]> => ({ planning: [], running: [], done: [] });

/** Os projetos agrupados pelo estado calculado das etapas, com a data de hoje para os prazos. */
export const useProjectsList = () => {
  const projectsQuery = useProjects();
  const calendarQuery = useCalendar();
  const projects = projectsQuery.data;

  const byStage = useMemo(() => {
    const groups = EMPTY_GROUPS();
    for (const project of projects ?? []) groups[projectStage(project.milestones)].push(project);
    return groups;
  }, [projects]);

  return {
    byStage,
    total: projects?.length ?? 0,
    today: calendarQuery.data?.today,
    isPending: projectsQuery.isPending || calendarQuery.isPending,
    error: projectsQuery.error ?? calendarQuery.error,
    refetch: () => Promise.all([projectsQuery.refetch(), calendarQuery.refetch()]),
  };
};
