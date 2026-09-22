import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/auth';
import type { LoginPayload, LoginResult } from '../types';
import { session } from './session';

export const login = async (payload: LoginPayload): Promise<LoginResult> => {
  const result = await mockRequest(() => server.login(payload));
  if (result.outcome !== 'notice') session.start(server.DEMO_TOKEN);
  return result;
};

export const requestPasswordReset = () => mockRequest(() => server.requestPasswordReset());

export const getCurrentUser = () => mockRequest(() => server.getCurrentUser());

export const logout = () => session.end();
