import { db, RuleError } from '../db';

export type AccessRole = keyof typeof db.access;

const emailOf = (role: AccessRole) => (role === 'docente' ? db.account.email : db.orgAccount.email);

/** Confere a senha e se a conta ainda existe, antes de abrir a sessão. */
export const checkLogin = (role: AccessRole, email: string, password: string) => {
  const access = db.access[role];
  if (access.deletedEmail && access.deletedEmail === email.trim().toLowerCase()) throw new RuleError('Esta conta foi excluída. Para voltar, crie uma conta nova.');
  if (access.password !== null && password !== access.password) throw new RuleError('Senha incorreta. Confira e tente de novo.');
};

/** O que o código confirma: o e-mail de um cadastro novo ou o pedido de senha nova. */
export type CodePurpose = 'cadastro' | 'senha';

export const CODE_RESEND_SECONDS = 30;
const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const codeKey = (purpose: CodePurpose, role: AccessRole, email: string) => `${purpose}:${role}:${normalizeEmail(email)}`;

/** Senha com pelo menos 8 caracteres, letras e números. */
export const checkPasswordRules = (password: string) => {
  if (password.length < 8) throw new RuleError('A senha precisa de pelo menos 8 caracteres.');
  if (!/[a-zA-ZÀ-ÿ]/.test(password) || !/\d/.test(password)) throw new RuleError('Use letras e números na senha.');
};

/** O e-mail já tem conta ativa neste perfil. */
export const isRegistered = (role: AccessRole, email: string) => {
  const normalized = normalizeEmail(email);
  if (db.access[role].deletedEmail === normalized) return false;
  return normalizeEmail(emailOf(role)) === normalized;
};

export interface CodeSent {
  sentTo: string;
  /** Na demonstração não há e-mail de verdade: o código volta para a tela mostrar. */
  demoCode: string;
  resendIn: number;
}

/** Envia (na demonstração, gera) um código de 6 números, que vale por 10 minutos. Pedir outro só depois de 30 segundos. */
export const sendCode = (purpose: CodePurpose, role: AccessRole, email: string): CodeSent => {
  const key = codeKey(purpose, role, email);
  const now = Date.now();
  const pending = db.codes[key];
  if (pending && now - pending.sentAt < CODE_RESEND_SECONDS * 1000) {
    throw new RuleError(`Espere ${Math.ceil((CODE_RESEND_SECONDS * 1000 - (now - pending.sentAt)) / 1000)} segundos para pedir outro código.`);
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  db.codes[key] = { code, sentAt: now, expiresAt: now + CODE_TTL_MS, attempts: 0 };
  return { sentTo: email.trim(), demoCode: code, resendIn: CODE_RESEND_SECONDS };
};

/** Confere o código: certo, dentro do prazo e sem tentativas demais. Usado uma vez, ele deixa de valer. */
export const verifyCode = (purpose: CodePurpose, role: AccessRole, email: string, code: string) => {
  const key = codeKey(purpose, role, email);
  const pending = db.codes[key];
  if (!pending) throw new RuleError('Peça um código primeiro.');
  if (Date.now() > pending.expiresAt) throw new RuleError('O código venceu. Toque em "Enviar outro código".');
  pending.attempts += 1;
  if (pending.attempts > MAX_ATTEMPTS) throw new RuleError('Muitas tentativas. Toque em "Enviar outro código".');
  if (code.replace(/\D/g, '') !== pending.code) throw new RuleError('Código incorreto. Confira os 6 números no e-mail.');
  delete db.codes[key];
};

export interface ResetPasswordPayload {
  email: string;
  code: string;
  password: string;
  confirm: string;
}

/** Senha nova pelo código enviado ao e-mail. Conta excluída não volta por aqui. */
export const resetPassword = (role: AccessRole, { email, code, password, confirm }: ResetPasswordPayload) => {
  if (db.access[role].deletedEmail === normalizeEmail(email)) throw new RuleError('Esta conta foi excluída. Para voltar, crie uma conta nova.');
  checkPasswordRules(password);
  if (password !== confirm) throw new RuleError('As duas senhas não são iguais.');
  verifyCode('senha', role, email, code);
  db.access[role].password = password;
};

export interface ChangePasswordPayload {
  current: string;
  next: string;
  confirm: string;
}

export const changePassword = (role: AccessRole, { current, next, confirm }: ChangePasswordPayload) => {
  const access = db.access[role];
  if (!current) throw new RuleError('Informe a senha atual.');
  if (access.password !== null && current !== access.password) throw new RuleError('A senha atual não confere.');
  checkPasswordRules(next);
  if (next !== confirm) throw new RuleError('As duas senhas novas não são iguais.');
  if (next === current) throw new RuleError('A senha nova precisa ser diferente da atual.');
  access.password = next;
};

/** Excluir pede o e-mail digitado, para ninguém apagar a conta com um clique sem querer. */
export const deleteAccount = (role: AccessRole, typedEmail: string) => {
  const email = emailOf(role).toLowerCase();
  if (typedEmail.trim().toLowerCase() !== email) throw new RuleError('Digite o e-mail da conta exatamente como aparece acima.');
  db.access[role].deletedEmail = email;
};

/** Cadastro novo com o mesmo e-mail traz a conta de volta, com a senha escolhida no cadastro. */
export const resetAccess = (role: AccessRole, email: string, password: string) => {
  const access = db.access[role];
  if (access.deletedEmail === email.trim().toLowerCase()) access.deletedEmail = null;
  access.password = password;
};
