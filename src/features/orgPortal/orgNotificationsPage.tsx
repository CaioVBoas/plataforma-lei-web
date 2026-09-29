import { EmptyState } from '@/components/ui/emptyState';
import { NotificationsView } from '@/features/notifications/notificationsPage';
import { SubmitDemandLink } from './components/submitDemandLink';
import { useOrgNotifications } from './useOrgNotifications';

export const OrgNotificationsPage = () => {
  const { notifications } = useOrgNotifications();
  return (
    <NotificationsView
      notifications={notifications}
      empty={
        <EmptyState
          title="Nenhum aviso"
          description="Perguntas de docentes, pedidos de ajuste do L.E.I. e as etapas dos projetos aparecem aqui."
          action={<SubmitDemandLink />}
        />
      }
    />
  );
};
