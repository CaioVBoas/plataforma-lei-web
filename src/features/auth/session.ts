import type { UserRole } from './types';

/** Mesma chave que o api-client lê para enviar o Bearer token. */
const TOKEN_KEY = 'auth_token';
/** Qual portal a sessão abre. Sessão antiga, sem perfil guardado, é de docente. */
const ROLE_KEY = 'auth_role';

export const session = {
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
  role: (): UserRole => (localStorage.getItem(ROLE_KEY) === 'organizacao' ? 'organizacao' : 'docente'),
  start: (token: string, role: UserRole) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  },
  end: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};
