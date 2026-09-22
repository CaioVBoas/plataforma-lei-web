import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries';
import * as proposalsApi from '../api/proposals-api';
import type { SaveProposalPayload } from '../types';

export const proposalKeys = {
  all: ['proposals'] as const,
  detail: (proposalId: string) => ['proposals', proposalId] as const,
};

export const useProposals = () => useQuery({ queryKey: proposalKeys.all, queryFn: proposalsApi.getProposals });

export const useProposal = (proposalId: string | undefined) =>
  useQuery({
    queryKey: proposalKeys.detail(proposalId ?? ''),
    queryFn: () => proposalsApi.getProposal(proposalId ?? ''),
    enabled: Boolean(proposalId),
  });

export const useSaveProposal = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: (payload: SaveProposalPayload) => proposalsApi.saveProposal(payload),
    onSuccess: () => invalidate([proposalKeys.all]),
  });
};

export const useRegisterProposal = (proposalId: string) => {
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: (isoDate: string) => proposalsApi.registerProposal(proposalId, isoDate),
    onSuccess: () => invalidate([proposalKeys.all]),
  });
};

export const useToggleProposalArchive = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn: proposalsApi.toggleProposalArchive, onSuccess: () => invalidate([proposalKeys.all]) });
};
