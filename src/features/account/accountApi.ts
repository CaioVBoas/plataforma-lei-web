import type { Account } from '@/domain/types';
import { api, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/account';
import { mockRequest } from '@/mocks/mockRequest';

export const getAccount = () =>
  mocksEnabled
    ? mockRequest(() => server.getAccount())
    : api.get<Account>('/account/me').then((response) => response.data);

export const updateAccount = (patch: Partial<Omit<Account, 'email'>>) =>
  mocksEnabled
    ? mockRequest(() => server.updateAccount(patch))
    : api.patch<Account>('/account/me', patch).then((response) => response.data);
