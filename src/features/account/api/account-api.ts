import type { Account } from '@/domain/types';
import * as server from '@/mocks/handlers/account';
import { mockRequest } from '@/mocks/mock-request';

export const getAccount = () => mockRequest(() => server.getAccount());

export const updateAccount = (patch: Partial<Omit<Account, 'email'>>) => mockRequest(() => server.updateAccount(patch));
