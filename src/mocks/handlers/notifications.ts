import type { AppNotification, ChannelPreference, NotificationPreferences, PreferenceType } from '@/features/notifications/types';
import { db, findOrThrow } from '../db';

const findNotification = (id: string) => findOrThrow(db.notifications, id, 'Notificação');

export const listNotifications = (): AppNotification[] => db.notifications;

export const markNotificationRead = (id: string) => {
  findNotification(id).read = true;
};

export const markAllNotificationsRead = () => {
  db.notifications.forEach((notification) => {
    notification.read = true;
  });
};

export const toggleNotificationArchive = (id: string) => {
  const notification = findNotification(id);
  notification.archived = !notification.archived;
};

export const getNotificationPreferences = (): NotificationPreferences => db.notificationPreferences;

export const toggleNotificationChannel = (type: PreferenceType, channel: keyof ChannelPreference) => {
  const preference = db.notificationPreferences[type];
  preference[channel] = !preference[channel];
};
