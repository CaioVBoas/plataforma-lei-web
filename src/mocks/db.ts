import type { Organization, OrganizationContact } from '@/domain/types';
import { ACCOUNT } from './seed/account';
import { CALENDAR } from './seed/calendar';
import { DEMANDS } from './seed/demands';
import { DISCIPLINES } from './seed/disciplines';
import { ORGANIZATIONS } from './seed/organizations';
import { PROJECTS } from './seed/projects';

/** O backend guarda o contato junto da organização, mas só o entrega a quem tem projeto com ela. */
export type OrganizationRecord = Organization & { contact: OrganizationContact };

/**
 * Estado mutável do backend simulado. Vive só na memória da aba: recarregar a
 * página volta tudo ao cenário de demonstração.
 */
export const db = {
  calendar: structuredClone(CALENDAR),
  account: structuredClone(ACCOUNT),
  organizations: structuredClone(ORGANIZATIONS),
  demands: structuredClone(DEMANDS),
  disciplines: structuredClone(DISCIPLINES),
  projects: structuredClone(PROJECTS),
};

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/** Violação de regra de negócio. A mensagem vai direto para a tela, então é escrita para o docente. */
export class RuleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RuleError';
  }
}

export const findOrThrow = <Item extends { id: string }>(items: Item[], id: string, notFoundMessage: string) => {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new NotFoundError(notFoundMessage);
  return item;
};
