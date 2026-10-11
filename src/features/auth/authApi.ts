import * as server from '@/mocks/handlers/account';
import * as accessServer from '@/mocks/handlers/access';
import * as orgServer from '@/mocks/handlers/orgPortal';
import { mockRequest } from '@/mocks/mockRequest';
import type { OrgSignupPayload } from '@/features/orgPortal/types';
import type { LoginPayload, SignupPayload } from './types';
import { session } from './session';

export const login = async (payload: LoginPayload) => {
  const token = await mockRequest(() => server.login(payload));
  session.start(token, 'docente');
};

export const requestSignupCode = (payload: SignupPayload) => mockRequest(() => server.requestSignupCode(payload));

export const signup = async ({ payload, code }: { payload: SignupPayload; code: string }) => {
  const token = await mockRequest(() => server.signup(payload, code));
  session.start(token, 'docente');
};

export const loginOrganization = async (payload: LoginPayload) => {
  const token = await mockRequest(() => orgServer.login(payload));
  session.start(token, 'organizacao');
};

export const requestOrgSignupCode = (payload: OrgSignupPayload) => mockRequest(() => orgServer.requestSignupCode(payload));

export const signupOrganization = async ({ payload, code }: { payload: OrgSignupPayload; code: string }) => {
  const token = await mockRequest(() => orgServer.signup(payload, code));
  session.start(token, 'organizacao');
};

type AccessRole = 'docente' | 'organizacao';

/** Senha nova: o código vai para o e-mail, e com ele a pessoa escolhe a senha. */
export const requestPasswordReset = ({ role, email }: { role: AccessRole; email: string }) =>
  mockRequest(() => (role === 'docente' ? server.requestPasswordReset(email) : orgServer.requestPasswordReset(email)));

export const resetPassword = ({ role, ...payload }: { role: AccessRole } & accessServer.ResetPasswordPayload) => mockRequest(() => accessServer.resetPassword(role, payload));

export const logout = () => session.end();
