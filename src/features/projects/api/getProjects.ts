import { api } from '@/lib/apiClient';
import type { Project } from '../types/projectTypes';

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};
