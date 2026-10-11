import { Link } from 'react-router-dom';
import { BellIcon } from '@/components/ui/icons';
import type { PortalNotification } from '@/features/notifications/buildNotifications';
import { NotificationItem } from '@/features/notifications/notificationItem';
import { usePopover } from '@/hooks/usePopover';
import { cn } from '@/utils/cn';

const IN_POPOVER = 5;

interface NotificationsBellProps {
  notifications?: PortalNotification[];
  /** Quantos avisos pedem decisão: o único contador do portal. */
  pending: number;
  /** Página com todos os avisos do perfil. */
  allPath: string;
}

/** O sino da barra superior: o único contador do portal e os avisos mais recentes. */
export const NotificationsBell = ({ notifications = [], pending, allPath }: NotificationsBellProps) => {
  const { open, toggle, close, containerRef } = usePopover();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={pending > 0 ? `Avisos, ${pending} pedem sua decisão` : 'Avisos'}
        onClick={toggle}
        className={cn('relative flex size-10 items-center justify-center rounded-md text-ink-2', open ? 'bg-fill text-ink' : 'hover:bg-fill hover:text-ink')}
      >
        <BellIcon size={20} />
        {pending > 0 && (
          <span className="absolute top-0.5 -right-0.5 min-w-[18px] rounded-full bg-accent px-1 text-center text-caption font-semibold text-white tabular-nums ring-2 ring-surface">
            {pending}
          </span>
        )}
      </button>

      {open && (
        <div role="dialog" aria-label="Avisos" className="absolute top-12 right-0 z-40 w-[min(380px,calc(100vw-24px))] rounded-lg bg-surface shadow-popover animate-fade-in">
          <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
            <p className="text-body font-semibold text-ink">Avisos</p>
            {pending > 0 && <p className="text-caption text-ink-3">{pending === 1 ? '1 pede sua decisão' : `${pending} pedem sua decisão`}</p>}
          </div>
          {notifications.length === 0 ? (
            <p className="px-4 pt-1 pb-5 text-small text-ink-3">Nada novo por enquanto.</p>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto px-1.5">
              {notifications.slice(0, IN_POPOVER).map((item) => (
                <li key={item.id}>
                  <NotificationItem item={item} compact onNavigate={close} />
                </li>
              ))}
            </ul>
          )}
          <div className="mt-1 border-t border-line p-1.5">
            <Link to={allPath} onClick={close} className="flex h-9 items-center justify-center rounded-md text-small font-medium text-brand-strong hover:bg-brand-50">
              Ver todos os avisos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
