import type { CurrentUser, LoginPayload, LoginResult } from '@/features/auth/types';
import { CURRENT_USER } from '../seed/profile';

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

/** Conta de demonstração com dois papéis (docente e coordenadora adjunta). */
const HAS_TWO_ROLES = /^paola/i;

export const DEMO_TOKEN = 'demo-token';

export const login = ({ portal, email }: LoginPayload): LoginResult => {
  const normalizedEmail = email.trim();

  if (portal === 'organization') {
    return { outcome: 'notice', message: 'Organizações entram pelo convite enviado por e-mail pela coordenação de extensão.' };
  }
  if (!INSTITUTIONAL_EMAIL.test(normalizedEmail)) {
    throw new Error('Use seu e-mail @cin.ufpe.br ou @ufpe.br');
  }
  if (HAS_TWO_ROLES.test(normalizedEmail) || portal === 'coordination') {
    return { outcome: 'choose-area' };
  }
  return { outcome: 'signed-in' };
};

export const requestPasswordReset = () => 'Enviamos o link de recuperação para o seu e-mail institucional.';

export const getCurrentUser = (): CurrentUser => CURRENT_USER;
