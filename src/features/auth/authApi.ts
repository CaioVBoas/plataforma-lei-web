import * as server from '@/mocks/handlers/account';
import * as orgServer from '@/mocks/handlers/orgPortal';
import { mockRequest } from '@/mocks/mockRequest';
import type { OrgSignupPayload } from '@/features/orgPortal/types';
import type { LoginPayload, SignupPayload } from './types';
import { session } from './session';

export const login = async (payload: LoginPayload) => {
  const token = await mockRequest(() => server.login(payload));
  session.start(token, 'docente');
};

export const signup = async (payload: SignupPayload) => {
  const token = await mockRequest(() => server.signup(payload));
  session.start(token, 'docente');
};

export const loginOrganization = async (payload: LoginPayload) => {
  const token = await mockRequest(() => orgServer.login(payload));
  session.start(token, 'organizacao');
};

export const signupOrganization = async (payload: OrgSignupPayload) => {
  const token = await mockRequest(() => orgServer.signup(payload));
  session.start(token, 'organizacao');
};

export const logout = () => session.end();
