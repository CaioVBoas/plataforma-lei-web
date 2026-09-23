import * as server from '@/mocks/handlers/organizations';
import { mockRequest } from '@/mocks/mockRequest';

export const getOrganizations = () => mockRequest(() => server.listOrganizations());

export const getOrganization = (id: string) => mockRequest(() => server.getOrganization(id));
