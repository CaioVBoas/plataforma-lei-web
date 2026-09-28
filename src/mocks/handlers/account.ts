import type { Account } from '@/domain/types';
import type { LoginPayload, SignupPayload } from '@/features/auth/types';
import { db, RuleError } from '../db';

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

export const DEMO_TOKEN = 'demo-token';

/** Qualquer e-mail institucional entra na conta de demonstração. */
export const login = ({ email }: LoginPayload) => {
  if (!INSTITUTIONAL_EMAIL.test(email.trim())) throw new RuleError('Use seu e-mail @ufpe.br ou @cin.ufpe.br.');
  return DEMO_TOKEN;
};

/** Cadastro do docente: guarda nome, e-mail e departamento e já entra no portal. */
export const signup = ({ name, email, department, password }: SignupPayload) => {
  if (!name.trim()) throw new RuleError('Informe seu nome.');
  if (!INSTITUTIONAL_EMAIL.test(email.trim())) throw new RuleError('Use seu e-mail @ufpe.br ou @cin.ufpe.br.');
  if (password.length < 8) throw new RuleError('A senha precisa de pelo menos 8 caracteres.');
  Object.assign(db.account, { name: name.trim(), email: email.trim().toLowerCase(), department: department.trim(), tutorialSeen: false });
  return DEMO_TOKEN;
};

export const getAccount = (): Account => db.account;

export const updateAccount = (patch: Partial<Omit<Account, 'email'>>): Account => {
  if (patch.name !== undefined && !patch.name.trim()) throw new RuleError('Informe seu nome.');
  Object.assign(db.account, patch);
  return db.account;
};

export const getCalendar = () => db.calendar;
