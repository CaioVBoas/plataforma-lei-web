import type { Organization, OrganizationContact } from '@/domain/types';
import { ACCOUNT } from './seed/account';
import { CALENDAR } from './seed/calendar';
import { DEMANDS } from './seed/demands';
import { DISCIPLINES } from './seed/disciplines';
import { ORG_ACCOUNT } from './seed/orgAccount';
import { ORGANIZATIONS } from './seed/organizations';
import { PROJECTS } from './seed/projects';
import { SUBMISSIONS } from './seed/submissions';

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
  /** Quem está no portal da organização. */
  orgAccount: structuredClone(ORG_ACCOUNT),
  /** Pedidos das organizações que ainda não entraram no cardápio. */
  submissions: structuredClone(SUBMISSIONS),
  /**
   * Senha e exclusão de conta de cada portal. Na demonstração qualquer senha
   * entra, até alguém trocar a senha: daí só a nova serve. Conta excluída não
   * entra mais com aquele e-mail.
   */
  access: {
    docente: { password: null as string | null, deletedEmail: null as string | null },
    organizacao: { password: null as string | null, deletedEmail: null as string | null },
  },
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
