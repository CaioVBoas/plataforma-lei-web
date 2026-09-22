import * as server from '@/mocks/handlers/demands';
import { mockRequest } from '@/mocks/mock-request';

export const getOpenDemands = () => mockRequest(() => server.listOpenDemands());

export const getDemand = (id: string) => mockRequest(() => server.getDemand(id));
