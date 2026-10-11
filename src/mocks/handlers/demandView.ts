import type { Demand } from '@/domain/types';
import { db } from '../db';

/**
 * A demanda como o docente que está na sessão a vê: com a logo atual da
 * organização e a indicação do L.E.I. só se ela foi para ele.
 */
export const forTeacher = ({ invitation, ...demand }: Demand): Demand => {
  const logo = db.organizations.find((organization) => organization.id === demand.organization.id)?.logo;
  const mine = invitation && invitation.to.toLowerCase() === db.account.email.toLowerCase();
  return {
    ...demand,
    organization: logo ? { ...demand.organization, logo } : demand.organization,
    ...(mine ? { invitation } : {}),
  };
};
