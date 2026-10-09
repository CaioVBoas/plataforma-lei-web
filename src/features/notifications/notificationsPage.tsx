import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LoadingState } from '@/components/feedback/queryStates';
import { buttonClassName } from '@/components/ui/buttonStyles';
import { EmptyState } from '@/components/ui/emptyState';
import { TrayIcon } from '@/components/ui/icons';
import { Page, Section } from '@/components/ui/page';
import { paths } from '@/routes/paths';
import type { PortalNotification } from './buildNotifications';
import { NotificationItem } from './notificationItem';
import { useNotifications } from './useNotifications';

const NotificationGroup = ({ title, items }: { title: string; items: PortalNotification[] }) => (
  <Section title={title} compact>
    <ul className="divide-y divide-line rounded-lg border border-line bg-surface px-3">
      {items.map((item) => (
        <li key={item.id}>
          <NotificationItem item={item} />
        </li>
      ))}
    </ul>
  </Section>
);

/** Página de avisos de qualquer perfil: primeiro o que pede decisão, depois as novidades. */
export const NotificationsView = ({ notifications, empty }: { notifications?: PortalNotification[]; empty: ReactNode }) => {
  if (!notifications) return <LoadingState />;

  const actionable = notifications.filter((item) => item.actionable);
  const news = notifications.filter((item) => !item.actionable);

  return (
    <Page title="Avisos">
      {notifications.length === 0 ? (
        empty
      ) : (
        <>
          {actionable.length > 0 && <NotificationGroup title="Pede sua decisão" items={actionable} />}
          {news.length > 0 && <NotificationGroup title="Novidades" items={news} />}
        </>
      )}
    </Page>
  );
};

export const NotificationsPage = () => {
  const { notifications } = useNotifications();
  return (
    <NotificationsView
      notifications={notifications}
      empty={
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
      }
    />
  );
};
