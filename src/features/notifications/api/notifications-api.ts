import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/notifications';
import type { ChannelPreference, PreferenceType } from '../types';

export const getNotifications = () => mockRequest(() => server.listNotifications());

export const markNotificationRead = (notificationId: string) => mockRequest(() => server.markNotificationRead(notificationId));

export const markAllNotificationsRead = () => mockRequest(() => server.markAllNotificationsRead());

export const toggleNotificationArchive = (notificationId: string) =>
  mockRequest(() => server.toggleNotificationArchive(notificationId));

export const getNotificationPreferences = () => mockRequest(() => server.getNotificationPreferences());

export const toggleNotificationChannel = (type: PreferenceType, channel: keyof ChannelPreference) =>
  mockRequest(() => server.toggleNotificationChannel(type, channel));
