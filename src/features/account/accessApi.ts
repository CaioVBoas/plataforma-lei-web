import * as server from '@/mocks/handlers/access';
import { mockRequest } from '@/mocks/mockRequest';

export type { AccessRole, ChangePasswordPayload } from '@/mocks/handlers/access';

export const changePassword = (role: server.AccessRole, payload: server.ChangePasswordPayload) => mockRequest(() => server.changePassword(role, payload));

export const deleteAccount = (role: server.AccessRole, typedEmail: string) => mockRequest(() => server.deleteAccount(role, typedEmail));
