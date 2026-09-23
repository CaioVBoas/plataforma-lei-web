/** Mesma chave que o api-client lê para enviar o Bearer token. */
const TOKEN_KEY = 'auth_token';

export const session = {
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY)),
  start: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  end: () => localStorage.removeItem(TOKEN_KEY),
};
