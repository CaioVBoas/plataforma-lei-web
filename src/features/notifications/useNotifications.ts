import { useMemo } from 'react';
import { useCalendar } from '@/features/calendar/useCalendar';
import { useMenu } from '@/features/demands/useDemands';
import { useAgenda } from '@/features/projects/shared/hooks/useAgenda';
import { buildNotifications } from './buildNotifications';

/** Avisos derivados do cardápio, dos projetos e do calendário. Alimenta o sino e a página de avisos. */
export const useNotifications = () => {
  const { agenda } = useAgenda();
  const { data: menu } = useMenu();
  const { data: calendar } = useCalendar();

  const notifications = useMemo(
    () => (agenda && menu && calendar ? buildNotifications(agenda, menu, calendar.today) : undefined),
    [agenda, menu, calendar],
  );

  return {
    notifications,
    /** O único contador do portal: quanta coisa pede decisão agora. */
    pending: notifications?.filter((item) => item.actionable).length ?? 0,
  };
};
