import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries';
import * as notificationsApi from '../api/notifications-api';
import type { ChannelPreference, PreferenceType } from '../types';

export const notificationKeys = {
  all: ['notifications'] as const,
  preferences: ['notifications', 'preferences'] as const,
};

export const useNotifications = () => useQuery({ queryKey: notificationKeys.all, queryFn: notificationsApi.getNotifications });

const useNotificationMutation = <Variables>(mutationFn: (variables: Variables) => Promise<void>) => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn, onSuccess: () => invalidate([notificationKeys.all]) });
};

export const useMarkNotificationRead = () => useNotificationMutation(notificationsApi.markNotificationRead);

export const useMarkAllNotificationsRead = () => useNotificationMutation(() => notificationsApi.markAllNotificationsRead());

export const useToggleNotificationArchive = () => useNotificationMutation(notificationsApi.toggleNotificationArchive);

export const useNotificationPreferences = () =>
  useQuery({ queryKey: notificationKeys.preferences, queryFn: notificationsApi.getNotificationPreferences });

export const useToggleNotificationChannel = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: ({ type, channel }: { type: PreferenceType; channel: keyof ChannelPreference }) =>
      notificationsApi.toggleNotificationChannel(type, channel),
    onSuccess: () => invalidate([notificationKeys.preferences]),
  });
};
