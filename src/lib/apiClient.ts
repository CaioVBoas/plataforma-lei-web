import axios from 'axios';
import { paths } from '@/routes/paths';
import { tokenStorage } from './tokenStorage';

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = apiClient;

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clearSession();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
        if (!window.location.pathname.startsWith(paths.login)) {
          window.location.href = paths.login;
        }
      }
    }

    const rawMessage = error.response?.data?.message;
    const customMessage = Array.isArray(rawMessage)
      ? rawMessage.join(', ')
      : rawMessage || error.message || 'Ocorreu um erro inesperado no servidor.';

    error.message = customMessage;
    return Promise.reject(error);
  },
);
