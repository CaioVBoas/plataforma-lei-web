import * as server from '@/mocks/handlers/account';
import { mockRequest } from '@/mocks/mockRequest';

export const getCalendar = () => mockRequest(() => server.getCalendar());
