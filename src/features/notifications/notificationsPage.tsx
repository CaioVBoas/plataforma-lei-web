import { Link } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { TrayIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { paths } from '@/routes/paths';
import { NotificationItem } from './notificationItem';
import { useNotifications } from './useNotifications';

export const NotificationsPage = () => {
  const { notifications } = useNotifications();
  if (!notifications) return <LoadingState />;

  const actionable = notifications.filter((item) => item.actionable);
  const news = notifications.filter((item) => !item.actionable);

  return (
    <Page title="Avisos">
      {notifications.length === 0 ? (
        <EmptyState
          title="Nenhum aviso"
          description="Reservas, prazos das etapas e respostas das organizações aparecem aqui."
          action={
            <Link to={paths.menu} className={buttonClassName({ variant: 'primary' })}>
              <TrayIcon size={16} />
              Abrir o cardápio
            </Link>
          }
        />
      ) : (
        <>
          {actionable.length > 0 && (
            <Section title="Pede sua decisão" compact>
              <ul className="-mx-3 divide-y divide-line">
                {actionable.map((item) => (
                  <li key={item.id}>
                    <NotificationItem item={item} />
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {news.length > 0 && (
            <Section title="Novidades" compact>
              <ul className="-mx-3 divide-y divide-line">
                {news.map((item) => (
                  <li key={item.id}>
                    <NotificationItem item={item} />
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </>
      )}
    </Page>
  );
};
