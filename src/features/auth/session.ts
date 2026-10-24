import { tokenStorage } from '@/lib/tokenStorage';
import type { UserRole } from './types';

export const session = {
  isAuthenticated: () => Boolean(tokenStorage.getToken()),
  role: (): UserRole => (tokenStorage.getRole() === 'organizacao' ? 'organizacao' : 'docente'),
  start: (token: string, role: UserRole) => {
    tokenStorage.setToken(token);
    tokenStorage.setRole(role);
  },
  end: () => {
    tokenStorage.clearSession();
  },
};
