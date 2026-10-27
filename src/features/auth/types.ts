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

/** Valores do enum `TipoParceiro` do backend. */
export type TipoParceiro = 'ORGAO_PUBLICO' | 'UNIDADE_UFPE' | 'ORGANIZACAO_SOCIAL_ONG' | 'EMPRESA' | 'OUTRO';

/**
 * Rótulos do seletor de tipo (`ORGANIZATION_TYPES`) para o enum do backend.
 * Coletivo não tem valor próprio no banco e vai como OUTRO.
 */
const ORG_TYPE_TO_TIPO_PARCEIRO: Record<string, TipoParceiro> = {
  'Órgão público': 'ORGAO_PUBLICO',
  'Organização social': 'ORGANIZACAO_SOCIAL_ONG',
  Coletivo: 'OUTRO',
  'Unidade da UFPE': 'UNIDADE_UFPE',
  Empresa: 'EMPRESA',
};

const TIPO_PARCEIRO_TO_ORG_TYPE: Record<TipoParceiro, string> = {
  ORGAO_PUBLICO: 'Órgão público',
  ORGANIZACAO_SOCIAL_ONG: 'Organização social',
  OUTRO: 'Coletivo',
  UNIDADE_UFPE: 'Unidade da UFPE',
  EMPRESA: 'Empresa',
};

export const mapOrgTypeToTipoParceiro = (type: string): TipoParceiro => ORG_TYPE_TO_TIPO_PARCEIRO[type] ?? 'OUTRO';

export const mapTipoParceiroToOrgType = (type: TipoParceiro): string => TIPO_PARCEIRO_TO_ORG_TYPE[type] ?? type;
