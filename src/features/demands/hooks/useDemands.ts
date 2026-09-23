import { useMutation, useQuery } from '@tanstack/react-query';
import { useInvalidateQueries } from '@/hooks/useInvalidateQueries';
import { queryKeys } from '@/lib/queryKeys';
import * as demandsApi from '../api/demandsApi';

/** Tudo que está no cardápio: livre ou reservado. */
export const useMenu = () => useQuery({ queryKey: queryKeys.demands, queryFn: demandsApi.getMenu });

export const useDemand = (id: string) => useQuery({ queryKey: queryKeys.demand(id), queryFn: () => demandsApi.getDemand(id) });

/** Reservar ou liberar muda o cardápio e a contagem de demandas abertas das organizações. */
const useDemandMutation = (mutationFn: (id: string) => Promise<unknown>) => {
  const invalidate = useInvalidateQueries();
  return useMutation({ mutationFn, onSuccess: () => invalidate([queryKeys.demands, queryKeys.organizations]) });
};

export const useReserveDemand = () => useDemandMutation(demandsApi.reserveDemand);

export const useReleaseReservation = () => useDemandMutation(demandsApi.releaseReservation);

export const useToggleWatch = () => useDemandMutation(demandsApi.toggleWatch);
