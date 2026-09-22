import type { ComponentType } from 'react';
import { BookmarkIcon, CalendarIcon, ClockIcon, MessageIcon, PlusIcon, TeamIcon } from '@/components/ui/icons';
import { cn } from '@/utils/cn';
import type { NotificationType } from '../types';

const ICON_BY_TYPE: Record<NotificationType, ComponentType<{ size?: number }>> = {
  demand: BookmarkIcon,
  reservation: ClockIcon,
  partner: MessageIcon,
  deadline: CalendarIcon,
  team: TeamIcon,
  invite: PlusIcon,
};

/** Demanda nova e convite são oportunidades, por isso ganham o fundo azul. */
const HIGHLIGHTED: NotificationType[] = ['demand', 'invite'];

interface NotificationIconProps {
  type: NotificationType;
  variant?: 'compact' | 'outlined';
}

export const NotificationIcon = ({ type, variant = 'compact' }: NotificationIconProps) => {
  const Icon = ICON_BY_TYPE[type];
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full',
        variant === 'compact' ? 'mt-px size-7' : 'size-9 border border-n-200 bg-n-0 text-n-500',
        variant === 'compact' && (HIGHLIGHTED.includes(type) ? 'bg-azul-50 text-azul-500' : 'text-n-700'),
      )}
    >
      <Icon size={variant === 'compact' ? 14 : 17} />
    </span>
  );
};
