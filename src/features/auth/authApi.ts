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

const isNetworkError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: string; isAxiosError?: boolean; response?: unknown };
    return Boolean(
      (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') && !err.response,
    );
  }
  return false;
};

export const login = async (payload: LoginPayload): Promise<void> => {
  if (mocksEnabled) {
    const token = await mockRequest(() => server.login(payload));
    session.start(token, 'docente');
    return;
  }

  try {
    const response = await apiClient.post<ApiAuthResponse>('/auth/login', payload);
    const role = apiRoleToUserRole(response.data.user.role);
    session.start(response.data.accessToken, role);
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de login docente:', error);
      const token = await mockRequest(() => server.login(payload));
      session.start(token, 'docente');
      return;
    }
    throw error;
  }
};

export const requestSignupCode = async (payload: SignupPayload): Promise<accessServer.CodeSent> => {
  if (mocksEnabled) {
    return mockRequest(() => server.requestSignupCode(payload));
  }

  try {
    const response = await apiClient.post<accessServer.CodeSent>('/auth/register/professor/code', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      department: payload.department,
    });
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de código de cadastro docente:', error);
      return mockRequest(() => server.requestSignupCode(payload));
    }
    throw error;
  }
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

  try {
    const response = await apiClient.post<ApiAuthResponse>('/auth/register/professor', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      department: payload.department,
      code,
    });
    const role = apiRoleToUserRole(response.data.user.role);
    session.start(response.data.accessToken, role);
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de cadastro docente:', error);
      const token = await mockRequest(() => server.signup(payload, code));
      session.start(token, 'docente');
      return;
    }
    throw error;
  }
};

export const loginOrganization = async (payload: LoginPayload): Promise<void> => {
  if (mocksEnabled) {
    const token = await mockRequest(() => orgServer.login(payload));
    session.start(token, 'organizacao');
    return;
  }

  try {
    const response = await apiClient.post<ApiAuthResponse>('/auth/login', payload);
    const role = apiRoleToUserRole(response.data.user.role);
    session.start(response.data.accessToken, role);
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de login de organização:', error);
      const token = await mockRequest(() => orgServer.login(payload));
      session.start(token, 'organizacao');
      return;
    }
    throw error;
  }
};

export const requestOrgSignupCode = async (
  payload: OrgSignupPayload,
): Promise<accessServer.CodeSent> => {
  if (mocksEnabled) {
    return mockRequest(() => orgServer.requestSignupCode(payload));
  }

  try {
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
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de código de cadastro de organização:', error);
      return mockRequest(() => orgServer.requestSignupCode(payload));
    }
    throw error;
  }
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

  try {
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
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de cadastro de organização:', error);
      const token = await mockRequest(() => orgServer.signup(payload, code));
      session.start(token, 'organizacao');
      return;
    }
    throw error;
  }
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

  try {
    const response = await apiClient.post<accessServer.CodeSent>('/auth/password-reset/code', {
      role,
      email,
    });
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de recuperação de senha:', error);
      return mockRequest(() =>
        role === 'docente'
          ? server.requestPasswordReset(email)
          : orgServer.requestPasswordReset(email),
      );
    }
    throw error;
  }
};

export const resetPassword = async ({
  role,
  ...payload
}: { role: AccessRole } & accessServer.ResetPasswordPayload): Promise<void> => {
  if (mocksEnabled) {
    return mockRequest(() => accessServer.resetPassword(role, payload));
  }

  try {
    await apiClient.post('/auth/password-reset', { role, ...payload });
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de redefinição de senha:', error);
      return mockRequest(() => accessServer.resetPassword(role, payload));
    }
    throw error;
  }
};

export const getMe = async (): Promise<ApiUserResponse> => {
  const response = await apiClient.get<ApiUserResponse>('/auth/me');
  return response.data;
};

export const logout = (): void => {
  session.end();
};
