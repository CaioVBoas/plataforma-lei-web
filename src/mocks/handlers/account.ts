import type { Account } from '@/domain/types';
import type { LoginPayload, SignupPayload } from '@/features/auth/types';
import { db, RuleError } from '../db';
import { checkLogin, checkPasswordRules, isRegistered, resetAccess, sendCode, verifyCode, type CodeSent } from './access';

const INSTITUTIONAL_EMAIL = /@(cin\.)?ufpe\.br$/i;

export const DEMO_TOKEN = 'demo-token';

/** Qualquer e-mail institucional entra na conta de demonstração. */
export const login = ({ email, password }: LoginPayload) => {
  if (!INSTITUTIONAL_EMAIL.test(email.trim())) throw new RuleError('Use seu e-mail @ufpe.br ou @cin.ufpe.br.');
  checkLogin('docente', email, password);
  return DEMO_TOKEN;
};

const isInstitutional = (email: string) => INSTITUTIONAL_EMAIL.test(email.trim());

/** As regras do cadastro do docente, conferidas antes de mandar o código e de novo ao criar a conta. */
const checkSignup = ({ name, email, department, password }: SignupPayload) => {
  if (!name.trim()) throw new RuleError('Informe seu nome.');
  if (!isInstitutional(email)) throw new RuleError('Use seu e-mail @ufpe.br ou @cin.ufpe.br.');
  if (isRegistered('docente', email)) throw new RuleError('Este e-mail já tem conta. Entre com ele ou use "Esqueci minha senha".');
  if (!department.trim()) throw new RuleError('Informe seu departamento.');
  checkPasswordRules(password);
};

/** Etapa 1 do cadastro: confere os dados e manda o código para o e-mail institucional. */
export const requestSignupCode = (payload: SignupPayload): CodeSent => {
  checkSignup(payload);
  return sendCode('cadastro', 'docente', payload.email);
};

/** Pedido de senha nova: o código vai para o e-mail institucional. */
export const requestPasswordReset = (email: string): CodeSent => {
  if (!isInstitutional(email)) throw new RuleError('Use seu e-mail @ufpe.br ou @cin.ufpe.br.');
  return sendCode('senha', 'docente', email);
};

/** Etapa 2 do cadastro: com o código certo, guarda nome, e-mail e departamento e já entra no portal. */
export const signup = (payload: SignupPayload, code: string) => {
  checkSignup(payload);
  verifyCode('cadastro', 'docente', payload.email, code);
  const { name, email, department, password } = payload;
  // Conta nova: nada da conta anterior (foto, telefone) passa para ela.
  db.account = { name: name.trim(), email: email.trim().toLowerCase(), department: department.trim(), phone: '', tutorialSeen: false };
  resetAccess('docente', email, password);
  return DEMO_TOKEN;
};

export const getAccount = (): Account => db.account;

export const updateAccount = (patch: Partial<Omit<Account, 'email'>>): Account => {
  if (patch.name !== undefined && !patch.name.trim()) throw new RuleError('Informe seu nome.');
  if (patch.photo && !patch.photo.startsWith('data:image/')) throw new RuleError('A foto precisa ser uma imagem.');
  Object.assign(db.account, patch);
  return db.account;
};

export const getCalendar = () => db.calendar;
