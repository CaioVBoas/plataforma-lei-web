export type NotificationType = 'demand' | 'reservation' | 'partner' | 'deadline' | 'team' | 'invite';

export interface AppNotification {
  id: string;
  /** Agrupador exibido na lista: "Hoje", "Ontem", "Esta semana". */
  dayGroup: string;
  type: NotificationType;
  text: string;
  context: string;
  timeAgo: string;
  link: string;
  urgent: boolean;
  read: boolean;
  archived: boolean;
}

export type PreferenceType = Extract<NotificationType, 'demand' | 'reservation' | 'deadline' | 'team'>;

export interface ChannelPreference {
  inApp: boolean;
  email: boolean;
}

export type NotificationPreferences = Record<PreferenceType, ChannelPreference>;
