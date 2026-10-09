import { apiClient } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/account';
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

const shouldUseMockOnly = import.meta.env.VITE_USE_MOCKS === 'true';

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
  if (shouldUseMockOnly) {
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

export const signup = async (payload: SignupPayload): Promise<void> => {
  if (shouldUseMockOnly) {
    const token = await mockRequest(() => server.signup(payload));
    session.start(token, 'docente');
    return;
  }

  try {
    const response = await apiClient.post<ApiAuthResponse>('/auth/register/professor', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });
    const role = apiRoleToUserRole(response.data.user.role);
    session.start(response.data.accessToken, role);
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de cadastro docente:', error);
      const token = await mockRequest(() => server.signup(payload));
      session.start(token, 'docente');
      return;
    }
    throw error;
  }
};

export const loginOrganization = async (payload: LoginPayload): Promise<void> => {
  if (shouldUseMockOnly) {
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

export const signupOrganization = async (payload: OrgSignupPayload): Promise<void> => {
  if (shouldUseMockOnly) {
    const token = await mockRequest(() => orgServer.signup(payload));
    session.start(token, 'organizacao');
    return;
  }

  try {
    const response = await apiClient.post<ApiAuthResponse>('/auth/register/partner', {
      name: payload.organizationName,
      type: mapOrgTypeToTipoParceiro(payload.organizationType),
      email: payload.email,
      password: payload.password,
    });
    const role = apiRoleToUserRole(response.data.user.role);
    session.start(response.data.accessToken, role);
  } catch (error) {
    if (import.meta.env.DEV && isNetworkError(error)) {
      console.warn('API local indisponível, acionando mock de cadastro de organização:', error);
      const token = await mockRequest(() => orgServer.signup(payload));
      session.start(token, 'organizacao');
      return;
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
