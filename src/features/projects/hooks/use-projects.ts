import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries';
import * as projectsApi from '../api/projects-api';
import type { NewLogEntryPayload } from '../types';

export const projectKeys = {
  all: ['projects'] as const,
  detail: (projectId: string) => ['projects', projectId] as const,
};

export const useProjects = () => useQuery({ queryKey: projectKeys.all, queryFn: projectsApi.getProjects });

export const useProject = (projectId: string) =>
  useQuery({ queryKey: projectKeys.detail(projectId), queryFn: () => projectsApi.getProject(projectId) });

const useProjectMutation = <Variables>(mutationFn: (variables: Variables) => Promise<void>) => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn, onSuccess: () => invalidate([projectKeys.all]) });
};

export const useLogCurrentWeek = () => useProjectMutation(projectsApi.logCurrentWeek);

export const useAddLogEntry = () => useProjectMutation((payload: NewLogEntryPayload) => projectsApi.addLogEntry(payload));

export const usePrepareReport = () => useProjectMutation(projectsApi.prepareReport);

export const usePublishOnShowcase = () => useProjectMutation(projectsApi.publishOnShowcase);
