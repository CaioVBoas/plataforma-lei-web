import axios from 'axios';
import { paths } from '@/routes/paths';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      if (!window.location.pathname.startsWith(paths.login)) {
        window.location.href = paths.login;
      }
    }
    const customMessage = error.response?.data?.message || 'Ocorreu um erro inesperado no servidor.';
    return Promise.reject(new Error(Array.isArray(customMessage) ? customMessage.join(', ') : customMessage));
  },
);
