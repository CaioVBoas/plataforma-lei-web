import { useMemo } from 'react';
import { useCalendar } from '@/features/calendar/useCalendar';
import { buildOrgNotifications } from './utils/orgNotifications';
import { useOrgDemands, useOrgProjects } from './useOrgPortal';

/** Avisos da organização, derivados das demandas e dos projetos dela. Alimenta o sino e a página de avisos. */
export const useOrgNotifications = () => {
  const { data: demands } = useOrgDemands();
  const { data: projects } = useOrgProjects();
  const { data: calendar } = useCalendar();

  const notifications = useMemo(
    () => (demands && projects && calendar ? buildOrgNotifications(demands, projects, calendar.today) : undefined),
    [demands, projects, calendar],
  );

  return { notifications, pending: notifications?.filter((item) => item.actionable).length ?? 0 };
};
