import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../api/get-projects';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
};
