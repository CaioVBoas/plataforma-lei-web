import type { SemesterCalendar } from '@/domain/types';
import { api, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/account';
import { mockRequest } from '@/mocks/mockRequest';

export const getCalendar = () =>
  mocksEnabled
    ? mockRequest(() => server.getCalendar())
    : api.get<SemesterCalendar>('/calendar/current').then((response) => response.data);
