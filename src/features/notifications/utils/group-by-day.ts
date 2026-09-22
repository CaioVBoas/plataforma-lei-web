import type { AppNotification } from '../types';

export interface NotificationGroup {
  day: string;
  items: AppNotification[];
}

/** Agrupa preservando a ordem em que os dias aparecem (mais recentes primeiro). */
export const groupByDay = (notifications: AppNotification[]): NotificationGroup[] =>
  notifications.reduce<NotificationGroup[]>((groups, notification) => {
    const group = groups.find((candidate) => candidate.day === notification.dayGroup);
    if (group) group.items.push(notification);
    else groups.push({ day: notification.dayGroup, items: [notification] });
    return groups;
  }, []);
