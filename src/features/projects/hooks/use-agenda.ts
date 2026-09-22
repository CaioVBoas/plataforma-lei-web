import { useMemo } from 'react';
import { useCalendar } from '@/features/calendar/hooks/use-calendar';
import { buildAgenda } from '../utils/agenda';
import { useProjects } from './use-projects';

/** Próximos passos de todos os projetos. Alimenta o Início e o contador da barra lateral. */
export const useAgenda = () => {
  const projectsQuery = useProjects();
  const calendarQuery = useCalendar();
  const projects = projectsQuery.data;
  const calendar = calendarQuery.data;

  const agenda = useMemo(() => (projects && calendar ? buildAgenda(projects, calendar.today) : undefined), [projects, calendar]);

  return { agenda, isPending: projectsQuery.isPending || calendarQuery.isPending };
};
