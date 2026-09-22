import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as organizationsApi from '../api/organizations-api';

export const useOrganizations = () => useQuery({ queryKey: queryKeys.organizations, queryFn: organizationsApi.getOrganizations });

export const useOrganization = (id: string) =>
  useQuery({ queryKey: queryKeys.organization(id), queryFn: () => organizationsApi.getOrganization(id) });
