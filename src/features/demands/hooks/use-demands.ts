import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as demandsApi from '../api/demands-api';

export const useOpenDemands = () => useQuery({ queryKey: queryKeys.demands, queryFn: demandsApi.getOpenDemands });

export const useDemand = (id: string) => useQuery({ queryKey: queryKeys.demand(id), queryFn: () => demandsApi.getDemand(id) });
