import { Link } from 'react-router-dom';
import { BellIcon, BookmarkIcon, ChatIcon, FolderIcon, MailIcon, UsersIcon } from '@/components/ui/icons';
import { Tag } from '@/components/ui/tag';
import { cn } from '@/utils/cn';
import type { NotificationKind, PortalNotification } from './buildNotifications';

const KIND_ICON: Record<NotificationKind, typeof BellIcon> = {
  invitation: MailIcon,
  reservation: BookmarkIcon,
  milestone: FolderIcon,
  released: BellIcon,
  answer: ChatIcon,
  question: ChatIcon,
  review: MailIcon,
  project: UsersIcon,
};

/** Um aviso: ícone do tipo, o que fazer em destaque, de onde vem e o prazo em tag. */
export const NotificationItem = ({ item, compact, onNavigate }: { item: PortalNotification; compact?: boolean; onNavigate?: () => void }) => {
  const Icon = KIND_ICON[item.kind];
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn('group flex gap-3 rounded-md transition-colors duration-150 hover:bg-brand-50', compact ? 'px-2.5 py-2.5' : 'px-3 py-3.5')}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-monogram text-monogram-ink">
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] leading-snug font-semibold text-ink group-hover:text-brand-strong">{item.title}</span>
        <span className="mt-0.5 block truncate text-[13px] text-ink-2">{item.context}</span>
        <span className="mt-1.5 block">
          <Tag tone={item.tone}>{item.label}</Tag>
        </span>
      </span>
    </Link>
  );
};
