import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as accountApi from '../api/account-api';

export const useAccount = () => useQuery({ queryKey: queryKeys.account, queryFn: accountApi.getAccount });

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApi.updateAccount,
    onSuccess: (account) => queryClient.setQueryData(queryKeys.account, account),
  });
};
