import { useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query';
import type { Project } from '@/domain/types';
import { useInvalidateQueries } from '@/hooks/useInvalidateQueries';
import { queryKeys } from '@/lib/queryKeys';
import * as projectsApi from '../api/projectsApi';

export const useProjects = () => useQuery({ queryKey: queryKeys.projects, queryFn: projectsApi.getProjects });

export const useProject = (id: string) => useQuery({ queryKey: queryKeys.project(id), queryFn: () => projectsApi.getProject(id) });

/**
 * Criar ou desfazer um projeto mexe no cardápio, nas vagas das disciplinas e
 * no histórico das organizações, então tudo isso é recarregado. A lista de
 * projetos é invalidada sozinha, sem o detalhe: o projeto desfeito não existe
 * mais e não deve ser buscado de novo.
 */
const useInvalidateProjectLifecycle = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateQueries();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.projects, exact: true }),
      invalidate([queryKeys.demands, queryKeys.disciplines, queryKeys.organizations]),
    ]);
};

export const useAdoptDemand = () => {
  const invalidateLifecycle = useInvalidateProjectLifecycle();
  return useMutation({ mutationFn: projectsApi.adoptDemand, onSuccess: invalidateLifecycle });
};

export const useWithdrawProject = () => {
  const invalidateLifecycle = useInvalidateProjectLifecycle();
  return useMutation({ mutationFn: projectsApi.withdrawProject, onSuccess: invalidateLifecycle });
};

/** Mutations que só mudam o próprio projeto atualizam o cache dele sem ida ao servidor. */
const useProjectMutation = <Input,>(mutationFn: (input: Input) => Promise<Project>, alsoInvalidate: QueryKey[] = []) => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn,
    onSuccess: (project) => {
      queryClient.setQueryData(queryKeys.project(project.id), project);
      return Promise.all([queryClient.invalidateQueries({ queryKey: queryKeys.projects, exact: true }), invalidate(alsoInvalidate)]);
    },
  });
};

export const useUpdatePlanSection = () => useProjectMutation(projectsApi.updatePlanSection);

export const useUpdateTeams = () => useProjectMutation(projectsApi.updateTeams);

/** Concluir o projeto libera vaga na disciplina e escreve no histórico da organização. */
export const useCompleteMilestone = () =>
  useProjectMutation(projectsApi.completeMilestone, [queryKeys.disciplines, queryKeys.organizations]);
