import { apiClient } from '@/lib/apiClient';
import type { AuthResponse, LoginCredentials, User, Role } from '../types/authTypes';

export interface DemoAccount {
  label: string;
  email: string;
  password: string;
  role: Role;
  name: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: 'Aluno / Discente',
    email: 'aluno@universidade.edu.br',
    password: 'password123',
    role: 'STUDENT',
    name: 'Lucas Pereira (Discente)',
  },
  {
    label: 'Organização / ONG',
    email: 'ong@verde.org',
    password: 'password123',
    role: 'ORGANIZATION',
    name: 'Instituto Verde Preservação',
  },
  {
    label: 'Docente / Professor',
    email: 'professor@universidade.edu.br',
    password: 'password123',
    role: 'PROFESSOR',
    name: 'Profª. Dra. Mariana Costa',
  },
];

const findDemoUser = (email: string): User | undefined => {
  const match = DEMO_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === email.trim().toLowerCase(),
  );
  if (!match) return undefined;
  return {
    id: `mock-${match.role.toLowerCase()}-id`,
    email: match.email,
    name: match.name,
    role: match.role,
  };
};

export const loginApi = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error: unknown) {
    // Modo de contingência para desenvolvimento enquanto o back-end (API-S1-02) não possui /auth/login
    if (import.meta.env.DEV) {
      const demoUser = findDemoUser(credentials.email);
      if (demoUser && credentials.password.length >= 6) {
        return {
          user: demoUser,
          accessToken: `mock-jwt-token-${demoUser.role.toLowerCase()}-${Date.now()}`,
        };
      }
    }
    throw error;
  }
};

export const getMeApi = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  } catch (error: unknown) {
    if (import.meta.env.DEV) {
      const token = localStorage.getItem('auth_token');
      if (token && token.startsWith('mock-jwt-token-')) {
        const role = token.split('-')[3]?.toUpperCase() as Role;
        const demo = DEMO_ACCOUNTS.find((acc) => acc.role === role) || DEMO_ACCOUNTS[0];
        return {
          id: `mock-${demo.role.toLowerCase()}-id`,
          email: demo.email,
          name: demo.name,
          role: demo.role,
        };
      }
    }
    throw error;
  }
};
