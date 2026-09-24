import type { OrganizationHistoryEntry } from '@/domain/types';

/** "parceria desde 2024.2", a partir do projeto concluído mais antigo. */
export const partnershipSince = (history: OrganizationHistoryEntry[]) => {
  const first = history.map((entry) => entry.semester).sort()[0];
  return first ? `parceria desde ${first}` : undefined;
};
