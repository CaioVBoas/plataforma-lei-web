import { db, RuleError } from '../db';

export type AccessRole = keyof typeof db.access;

const emailOf = (role: AccessRole) => (role === 'docente' ? db.account.email : db.orgAccount.email);

/** Confere a senha e se a conta ainda existe, antes de abrir a sessão. */
export const checkLogin = (role: AccessRole, email: string, password: string) => {
  const access = db.access[role];
  if (access.deletedEmail && access.deletedEmail === email.trim().toLowerCase()) throw new RuleError('Esta conta foi excluída. Para voltar, crie uma conta nova.');
  if (access.password !== null && password !== access.password) throw new RuleError('Senha incorreta. Confira e tente de novo.');
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
  if (next.length < 8) throw new RuleError('A senha nova precisa de pelo menos 8 caracteres.');
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
