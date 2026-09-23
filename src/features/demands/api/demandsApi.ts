import * as server from '@/mocks/handlers/demands';
import { mockRequest } from '@/mocks/mockRequest';

export const getMenu = () => mockRequest(() => server.listMenu());

export const getDemand = (id: string) => mockRequest(() => server.getDemand(id));

export const reserveDemand = (id: string) => mockRequest(() => server.reserveDemand(id));

export const releaseReservation = (id: string) => mockRequest(() => server.releaseReservation(id));

export const toggleWatch = (id: string) => mockRequest(() => server.toggleWatch(id));
