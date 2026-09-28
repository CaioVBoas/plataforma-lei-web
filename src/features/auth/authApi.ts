import * as server from '@/mocks/handlers/account';
import { mockRequest } from '@/mocks/mockRequest';
import type { LoginPayload, SignupPayload } from './types';
import { session } from './session';

export const login = async (payload: LoginPayload) => {
  const token = await mockRequest(() => server.login(payload));
  session.start(token);
};

export const signup = async (payload: SignupPayload) => {
  const token = await mockRequest(() => server.signup(payload));
  session.start(token);
};

export const logout = () => session.end();
