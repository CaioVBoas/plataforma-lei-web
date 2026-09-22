import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/use-invalidate-queries';
import type { PracticeChange } from '@/types/practice';
import * as profileApi from '../api/profile-api';
import type { AccountUpdate, OnboardingAnswers, PastProject, ThemeStance } from '../types';

export const profileKeys = {
  account: ['account'] as const,
  practice: ['practice'] as const,
};

export const useAccount = () => useQuery({ queryKey: profileKeys.account, queryFn: profileApi.getAccount });

export const useUpdateAccount = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: (update: AccountUpdate) => profileApi.updateAccount(update),
    onSuccess: () => invalidate([profileKeys.account]),
  });
};

export const usePractice = () => useQuery({ queryKey: profileKeys.practice, queryFn: profileApi.getPractice });

const usePracticeMutation = <Variables>(mutationFn: (variables: Variables) => Promise<void>) => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn, onSuccess: () => invalidate([profileKeys.practice]) });
};

export const useChangePractice = () => usePracticeMutation((change: PracticeChange) => profileApi.changePractice(change));

export const useSetThemeStance = () =>
  usePracticeMutation(({ theme, stance }: { theme: string; stance: ThemeStance | null }) => profileApi.setThemeStance(theme, stance));

export const useAddPastProject = () => usePracticeMutation((project: PastProject) => profileApi.addPastProject(project));

/** Concluir o onboarding muda a prática e também tira o convite do cardápio. */
export const useCompleteOnboarding = () => {
  const invalidate = useInvalidateQueries();
  return useMutation({
    mutationFn: (answers: OnboardingAnswers) => profileApi.completeOnboarding(answers),
    onSuccess: () => invalidate([profileKeys.practice, profileKeys.account]),
  });
};
