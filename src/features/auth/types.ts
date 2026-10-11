export interface LoginPayload {
  email: string;
  password: string;
}

/** Quem entra na plataforma. Docente e organização têm portal; o do estudante ainda não existe. */
export type UserRole = 'docente' | 'organizacao' | 'estudante';

export interface SignupPayload {
  name: string;
  email: string;
  department: string;
  password: string;
}

/** Papéis suportados no backend (plataforma-lei-api). */
export type ApiRole = 'STUDENT' | 'PROFESSOR' | 'ORGANIZATION';

export interface ApiUserResponse {
  id: string;
  email: string;
  role: ApiRole;
  name?: string;
}

export interface ApiAuthResponse {
  user: ApiUserResponse;
  accessToken: string;
}

export const apiRoleToUserRole = (role: ApiRole): UserRole => {
  switch (role) {
    case 'PROFESSOR':
      return 'docente';
    case 'ORGANIZATION':
      return 'organizacao';
    case 'STUDENT':
    default:
      return 'estudante';
  }
};

export const userRoleToApiRole = (role: UserRole): ApiRole => {
  switch (role) {
    case 'docente':
      return 'PROFESSOR';
    case 'organizacao':
      return 'ORGANIZATION';
    case 'estudante':
      return 'STUDENT';
  }
};

export const mapOrgTypeToTipoParceiro = (type: string): string => {
  switch (type) {
    case 'Órgão público ou autarquia':
      return 'ORGAO_PUBLICO';
    case 'Hospital ou unidade de saúde':
    case 'Escola ou espaço educativo':
      return 'UNIDADE_UFPE';
    case 'Associação comunitária':
    case 'Coletivo ou movimento social':
    case 'Fundação ou instituto':
      return 'ORGANIZACAO_SOCIAL_ONG';
    default:
      return 'OUTRO';
  }
};
