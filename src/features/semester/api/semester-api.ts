import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/semester';

export const getSemesterContext = () => mockRequest(() => server.getSemesterContext());
