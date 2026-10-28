import { api, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/access';
import { mockRequest } from '@/mocks/mockRequest';

export type { AccessRole, ChangePasswordPayload } from '@/mocks/handlers/access';

const passwordPath = (role: server.AccessRole) =>
  role === 'docente' ? '/account/me/password' : '/org-portal/account/password';

const deletePath = (role: server.AccessRole) =>
  role === 'docente' ? '/account/me/delete' : '/org-portal/account/delete';

export const changePassword = (
  role: server.AccessRole,
  payload: server.ChangePasswordPayload,
): Promise<void> =>
  mocksEnabled
    ? mockRequest(() => server.changePassword(role, payload))
    : api.post(passwordPath(role), payload).then(() => undefined);

export const deleteAccount = (role: server.AccessRole, typedEmail: string): Promise<void> =>
  mocksEnabled
    ? mockRequest(() => server.deleteAccount(role, typedEmail))
    : api.post(deletePath(role), { typedEmail }).then(() => undefined);
