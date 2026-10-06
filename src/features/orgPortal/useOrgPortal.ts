import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/useInvalidateQueries';
import { queryKeys } from '@/lib/queryKeys';
import * as orgPortalApi from './orgPortalApi';

export const useOrgAccount = () => useQuery({ queryKey: queryKeys.orgAccount, queryFn: orgPortalApi.getOrgAccount });

export const useUpdateOrgAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: orgPortalApi.updateOrgAccount, onSuccess: (account) => queryClient.setQueryData(queryKeys.orgAccount, account) });
};

export const useOrgProfile = () => useQuery({ queryKey: queryKeys.orgProfile, queryFn: orgPortalApi.getOrgProfile });

export const useUpdateOrgProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: orgPortalApi.updateOrgProfile, onSuccess: (profile) => queryClient.setQueryData(queryKeys.orgProfile, profile) });
};

/** A logo e a capa aparecem também para os docentes: a lista e a página das organizações recarregam. */
export const useUpdateOrgImages = () => {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: orgPortalApi.updateOrgImages,
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.orgProfile, profile);
      invalidate([queryKeys.organizations]);
    },
  });
};

export const useOrgDemands = () => useQuery({ queryKey: queryKeys.orgDemands, queryFn: orgPortalApi.getOrgDemands });

export const useOrgDemand = (id: string) => useQuery({ queryKey: queryKeys.orgDemand(id), queryFn: () => orgPortalApi.getOrgDemand(id) });

/** Salvar, enviar, excluir e responder mexem na lista e no detalhe: tudo que é da organização é recarregado. */
const useOrgMutation = <Payload, Result>(mutationFn: (payload: Payload) => Promise<Result>) => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn, onSuccess: () => invalidate([queryKeys.org]) });
};

export const useSaveDraft = () => useOrgMutation(orgPortalApi.saveDraft);

export const useSubmitForReview = () => useOrgMutation(orgPortalApi.submitForReview);

export const useDeleteDraft = () => useOrgMutation(orgPortalApi.deleteDraft);

export const useAnswerQuestion = () => useOrgMutation(orgPortalApi.answerQuestion);

export const useOrgProjects = () => useQuery({ queryKey: queryKeys.orgProjects, queryFn: orgPortalApi.getOrgProjects });

export const useOrgProject = (id: string) => useQuery({ queryKey: queryKeys.orgProject(id), queryFn: () => orgPortalApi.getOrgProject(id) });
