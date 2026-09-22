import * as server from '@/mocks/handlers/account';
import { mockRequest } from '@/mocks/mock-request';

export const getCalendar = () => mockRequest(() => server.getCalendar());
