const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_ROLE_KEY = 'auth_role';

export const tokenStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Erro ao salvar token no storage:', error);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao remover token do storage:', error);
    }
  },

  getRole: (): string | null => {
    try {
      return localStorage.getItem(AUTH_ROLE_KEY);
    } catch {
      return null;
    }
  },

  setRole: (role: string): void => {
    try {
      localStorage.setItem(AUTH_ROLE_KEY, role);
    } catch (error) {
      console.error('Erro ao salvar role no storage:', error);
    }
  },

  removeRole: (): void => {
    try {
      localStorage.removeItem(AUTH_ROLE_KEY);
    } catch (error) {
      console.error('Erro ao remover role do storage:', error);
    }
  },

  clearSession: (): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_ROLE_KEY);
    } catch (error) {
      console.error('Erro ao limpar sessão no storage:', error);
    }
  },
};
