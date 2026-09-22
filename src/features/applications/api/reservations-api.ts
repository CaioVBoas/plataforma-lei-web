import { mockRequest } from '@/mocks/mock-request';
import * as server from '@/mocks/handlers/applications';

/** Reservar e liberar são operações da demanda; aqui fica só a leitura agrupada por situação. */
export const getReservations = () => mockRequest(() => server.listReservations());
