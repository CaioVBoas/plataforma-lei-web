import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getMeApi, loginApi } from '@/features/auth/api/authApi';
import type { LoginCredentials, User } from '@/features/auth/types/authTypes';
import { AUTH_UNAUTHORIZED_EVENT } from '@/lib/apiClient';
import { tokenStorage } from '@/lib/tokenStorage';
import { AuthContext, type AuthContextType } from './authContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => tokenStorage.getToken());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    tokenStorage.removeToken();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await loginApi(credentials);
      tokenStorage.setToken(response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Hidratação inicial do usuário com base no token armazenado
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = tokenStorage.getToken();
      if (!storedToken) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      try {
        const currentUser = await getMeApi();
        if (isMounted) {
          setUser(currentUser);
          setToken(storedToken);
        }
      } catch (error) {
        console.warn('Sessão expirada ou inválida ao inicializar:', error);
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  // Escuta evento de 401 disparado pelo interceptor do Axios
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [logout]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
