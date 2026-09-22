import { DEMANDS, EXPIRED_RESERVATIONS } from './seed/demands';
import { DISCIPLINES } from './seed/disciplines';
import { NOTIFICATION_PREFERENCES, NOTIFICATIONS } from './seed/notifications';
import { ACCOUNT, PRACTICE_PROFILE } from './seed/profile';
import { PROJECTS } from './seed/projects';
import { PROPOSALS } from './seed/proposals';
import type { ConversationMessage, ManualAssociation } from '@/features/matchmaking/types';

/**
 * Estado mutável do backend simulado. Vive só na memória da aba: recarregar a
 * página volta tudo ao cenário de demonstração.
 */
export const db = {
  demands: structuredClone(DEMANDS),
  sentMessages: {} as Record<string, ConversationMessage[]>,
  unansweredQuestions: new Set<string>(['nase']),
  manualAssociations: {} as Record<string, ManualAssociation[]>,
  /** Competências que o docente descartou da leitura automática, por demanda. */
  discardedReadings: {} as Record<string, string[]>,
  releasedReservations: [] as string[],
  expiredReservations: structuredClone(EXPIRED_RESERVATIONS),
  disciplines: structuredClone(DISCIPLINES),
  proposals: structuredClone(PROPOSALS),
  projects: structuredClone(PROJECTS),
  notifications: structuredClone(NOTIFICATIONS),
  notificationPreferences: structuredClone(NOTIFICATION_PREFERENCES),
  account: structuredClone(ACCOUNT),
  practice: structuredClone(PRACTICE_PROFILE),
};

export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} ${id} não encontrado.`);
    this.name = 'NotFoundError';
  }
}

export const findOrThrow = <Item extends { id: string }>(items: Item[], id: string, entity: string) => {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new NotFoundError(entity, id);
  return item;
};
