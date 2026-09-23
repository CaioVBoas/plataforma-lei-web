import { useCallback } from 'react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';

/** Invalida várias queries de uma vez; usado no onSuccess das mutations. */
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (keys: QueryKey[]) => Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))),
    [queryClient],
  );
};
