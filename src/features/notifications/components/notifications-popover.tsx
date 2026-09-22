import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BellIcon } from '@/components/ui/icons';
import { usePopover } from '@/hooks/use-popover';
import { paths } from '@/routes/paths';
import { cn } from '@/utils/cn';
import { pluralize } from '@/utils/format';
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '../hooks/use-notifications';
import type { AppNotification } from '../types';
import { groupByDay } from '../utils/group-by-day';
import { NotificationIcon } from './notification-icon';

const UnreadDot = () => <span aria-hidden="true" className="mt-1.5 size-[7px] shrink-0 rounded-full bg-azul-500" />;

export const NotificationsPopover = () => {
  const navigate = useNavigate();
  const { open, toggle, close, containerRef } = usePopover();
  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const openNotification = (notification: AppNotification) => {
    markRead.mutate(notification.id);
    close();
    navigate(notification.link);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={unreadCount ? `Notificações, ${pluralize(unreadCount, 'não lida', 'não lidas')}` : 'Notificações'}
        aria-expanded={open}
        onClick={toggle}
        className={cn('relative flex size-8 items-center justify-center', open ? 'text-azul-800' : 'text-n-600 hover:text-n-800')}
      >
        <BellIcon />
        {unreadCount > 0 && <span aria-hidden="true" className="absolute top-1.5 right-[7px] size-[7px] rounded-full border-[1.5px] border-n-0 bg-azul-500" />}
      </button>

      {open && (
        <div className="absolute top-11 right-0 z-60 flex max-h-[480px] w-[400px] flex-col overflow-hidden rounded-lg border border-n-200 bg-n-0 shadow-popover animate-painel-entra">
          <div className="flex items-center justify-between gap-3 border-b border-n-200 px-4 py-3.5">
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="text-[15px] font-medium text-n-800">Notificações</span>
              <span className="text-xs text-n-500 tabular-nums">{unreadCount ? pluralize(unreadCount, 'não lida', 'não lidas') : 'todas lidas'}</span>
            </div>
            <Button variant="outline-accent" size="sm" onClick={() => markAllRead.mutate(undefined)}>
              Marcar todas como lidas
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-6 py-11 text-center text-sm leading-relaxed text-n-500">
                Nada novo por aqui. Avisamos quando uma demanda compatível entrar ou um parceiro responder.
              </p>
            ) : (
              groupByDay(notifications).map((group) => (
                <div key={group.day}>
                  <div className="border-b border-n-300 px-4 py-[9px] text-overline text-n-500">{group.day}</div>
                  {group.items.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => openNotification(notification)}
                      className="flex w-full items-start gap-[11px] border-b border-n-200 px-4 py-[13px] text-left hover:bg-n-50"
                    >
                      <NotificationIcon type={notification.type} />
                      <span className="min-w-0 flex-1">
                        <span className={cn('block text-sm leading-[1.45]', notification.read ? 'text-n-600' : 'font-medium text-n-800')}>{notification.text}</span>
                        <span className="mt-[3px] block text-xs text-n-500">{notification.timeAgo}</span>
                      </span>
                      {!notification.read && <UnreadDot />}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-n-200 px-4 py-3 text-center">
            <Button
              variant="outline-accent"
              size="sm"
              onClick={() => {
                close();
                navigate(paths.notifications);
              }}
            >
              Ver todas as notificações
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
