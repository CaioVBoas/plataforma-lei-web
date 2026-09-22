import * as server from '@/mocks/handlers/account';
import { mockRequest } from '@/mocks/mock-request';
import type { LoginPayload } from '../types';
import { session } from './session';

export const login = async (payload: LoginPayload) => {
  const token = await mockRequest(() => server.login(payload));
  session.start(token);
};

export const logout = () => session.end();
