import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/organizations';

export const getOrganizations = () => mockRequest(() => server.listOrganizations());

export const getOrganization = (organizationId: string) => mockRequest(() => server.getOrganization(organizationId));
