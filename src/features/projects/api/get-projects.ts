import { api } from '@/lib/api-client';
import type { Project } from '../types';

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};
