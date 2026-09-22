import * as server from '@/mocks/handlers/organizations';
import { mockRequest } from '@/mocks/mock-request';

export const getOrganizations = () => mockRequest(() => server.listOrganizations());

export const getOrganization = (id: string) => mockRequest(() => server.getOrganization(id));
