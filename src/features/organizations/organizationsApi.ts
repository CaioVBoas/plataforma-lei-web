import { api, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/organizations';
import { mockRequest } from '@/mocks/mockRequest';
import type { OrganizationDetail, OrganizationSummary } from './types';

export const getOrganizations = () =>
  mocksEnabled
    ? mockRequest(() => server.listOrganizations())
    : api.get<OrganizationSummary[]>('/organizations').then((response) => response.data);

/** O `contact` só vem quando o docente tem projeto com a organização: a API decide (regra 6). */
export const getOrganization = (id: string) =>
  mocksEnabled
    ? mockRequest(() => server.getOrganization(id))
    : api.get<OrganizationDetail>(`/organizations/${id}`).then((response) => response.data);
