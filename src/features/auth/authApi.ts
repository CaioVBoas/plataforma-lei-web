import { apiClient, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/account';
import * as accessServer from '@/mocks/handlers/access';
import * as orgServer from '@/mocks/handlers/orgPortal';
import { mockRequest } from '@/mocks/mockRequest';
import type { OrgSignupPayload } from '@/features/orgPortal/types';
import {
  apiRoleToUserRole,
  mapOrgTypeToTipoParceiro,
  type ApiAuthResponse,
  type ApiUserResponse,
  type LoginPayload,
  type SignupPayload,
} from './types';
import { session } from './session';

export const login = async (payload: LoginPayload): Promise<void> => {
  if (mocksEnabled) {
    const token = await mockRequest(() => server.login(payload));
    session.start(token, 'docente');
    return;
  }

  const response = await apiClient.post<ApiAuthResponse>('/auth/login', payload);
  const role = apiRoleToUserRole(response.data.user.role);
  if (role !== 'docente') {
    throw new Error(
      role === 'organizacao'
        ? 'Este e-mail pertence a uma organização parceira. Escolha a aba Organização acima.'
        : 'O acesso para estudantes estará disponível em breve.',
    );
  }
  session.start(response.data.accessToken, role);
};

export const requestSignupCode = async (payload: SignupPayload): Promise<accessServer.CodeSent> => {
  if (mocksEnabled) {
    return mockRequest(() => server.requestSignupCode(payload));
  }

  const response = await apiClient.post<accessServer.CodeSent>('/auth/register/professor/code', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    department: payload.department,
  });
  return response.data;
};

export const signup = async ({
  payload,
  code,
}: {
  payload: SignupPayload;
  code: string;
}): Promise<void> => {
  if (mocksEnabled) {
    const token = await mockRequest(() => server.signup(payload, code));
    session.start(token, 'docente');
    return;
  }

  const response = await apiClient.post<ApiAuthResponse>('/auth/register/professor', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    department: payload.department,
    code,
  });
  const role = apiRoleToUserRole(response.data.user.role);
  session.start(response.data.accessToken, role);
};

export const loginOrganization = async (payload: LoginPayload): Promise<void> => {
  if (mocksEnabled) {
    const token = await mockRequest(() => orgServer.login(payload));
    session.start(token, 'organizacao');
    return;
  }

  const response = await apiClient.post<ApiAuthResponse>('/auth/login', payload);
  const role = apiRoleToUserRole(response.data.user.role);
  if (role !== 'organizacao') {
    throw new Error(
      role === 'docente'
        ? 'Este e-mail pertence a um docente da UFPE. Escolha a aba Docente acima.'
        : 'O acesso para estudantes estará disponível em breve.',
    );
  }
  session.start(response.data.accessToken, role);
};

export const requestOrgSignupCode = async (
  payload: OrgSignupPayload,
): Promise<accessServer.CodeSent> => {
  if (mocksEnabled) {
    return mockRequest(() => orgServer.requestSignupCode(payload));
  }

  const response = await apiClient.post<accessServer.CodeSent>('/auth/register/partner/code', {
    name: payload.organizationName,
    type: mapOrgTypeToTipoParceiro(payload.organizationType),
    location: payload.location,
    focalName: payload.name,
    focalRole: payload.position,
    email: payload.email,
    password: payload.password,
  });
  return response.data;
};

export const signupOrganization = async ({
  payload,
  code,
}: {
  payload: OrgSignupPayload;
  code: string;
}): Promise<void> => {
  if (mocksEnabled) {
    const token = await mockRequest(() => orgServer.signup(payload, code));
    session.start(token, 'organizacao');
    return;
  }

  const response = await apiClient.post<ApiAuthResponse>('/auth/register/partner', {
    name: payload.organizationName,
    type: mapOrgTypeToTipoParceiro(payload.organizationType),
    location: payload.location,
    // Quem se cadastra é o ponto focal da organização.
    focalName: payload.name,
    focalRole: payload.position,
    email: payload.email,
    password: payload.password,
    code,
  });
  const role = apiRoleToUserRole(response.data.user.role);
  session.start(response.data.accessToken, role);
};

type AccessRole = 'docente' | 'organizacao';

/** Senha nova: o código vai para o e-mail, e com ele a pessoa escolhe a senha. */
export const requestPasswordReset = async ({
  role,
  email,
}: {
  role: AccessRole;
  email: string;
}): Promise<accessServer.CodeSent> => {
  if (mocksEnabled) {
    return mockRequest(() =>
      role === 'docente' ? server.requestPasswordReset(email) : orgServer.requestPasswordReset(email),
    );
  }

  const response = await apiClient.post<accessServer.CodeSent>('/auth/password-reset/code', {
    role,
    email,
  });
  return response.data;
};

export const resetPassword = async ({
  role,
  ...payload
}: { role: AccessRole } & accessServer.ResetPasswordPayload): Promise<void> => {
  if (mocksEnabled) {
    return mockRequest(() => accessServer.resetPassword(role, payload));
  }

  await apiClient.post('/auth/password-reset', { role, ...payload });
};

export const getMe = async (): Promise<ApiUserResponse> => {
  const response = await apiClient.get<ApiUserResponse>('/auth/me');
  return response.data;
};

export const logout = (): void => {
  session.end();
};
