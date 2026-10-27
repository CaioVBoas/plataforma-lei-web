import { apiClient, mocksEnabled } from '@/lib/apiClient';
import * as server from '@/mocks/handlers/demands';
import { mockRequest } from '@/mocks/mockRequest';
import type { Demand } from '@/domain/types';
import type { DemandDetail } from './types';

export const getMenu = async (): Promise<Demand[]> => {
  if (mocksEnabled) return mockRequest(() => server.listMenu());
  const response = await apiClient.get<Demand[]>('/demands/menu');
  return response.data;
};

export const getDemand = async (id: string): Promise<DemandDetail> => {
  if (mocksEnabled) return mockRequest(() => server.getDemand(id));
  const response = await apiClient.get<DemandDetail>(`/demands/${id}`);
  return response.data;
};

export const reserveDemand = async (id: string): Promise<Demand> => {
  if (mocksEnabled) return mockRequest(() => server.reserveDemand(id));
  const response = await apiClient.post<Demand>(`/demands/${id}/reserve`);
  return response.data;
};

export const releaseReservation = async (id: string): Promise<Demand> => {
  if (mocksEnabled) return mockRequest(() => server.releaseReservation(id));
  const response = await apiClient.post<Demand>(`/demands/${id}/release`);
  return response.data;
};

export const toggleWatch = async (id: string): Promise<Demand> => {
  if (mocksEnabled) return mockRequest(() => server.toggleWatch(id));
  const response = await apiClient.post<Demand>(`/demands/${id}/watch`);
  return response.data;
};

export const askQuestion = async ({
  id,
  text,
}: {
  id: string;
  text: string;
}): Promise<Demand> => {
  if (mocksEnabled) return mockRequest(() => server.askQuestion(id, text));
  const response = await apiClient.post<Demand>(`/demands/${id}/questions`, {
    text,
  });
  return response.data;
};
