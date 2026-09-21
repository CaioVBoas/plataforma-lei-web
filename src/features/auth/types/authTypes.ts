export type Role = 'STUDENT' | 'PROFESSOR' | 'ORGANIZATION' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
