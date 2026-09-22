import { useQuery } from '@tanstack/react-query';
import { getOrganization, getOrganizations } from '../api/organizations-api';

export const organizationKeys = {
  all: ['organizations'] as const,
  detail: (organizationId: string) => ['organizations', organizationId] as const,
};

export const useOrganizations = () => useQuery({ queryKey: organizationKeys.all, queryFn: getOrganizations });

export const useOrganization = (organizationId: string) =>
  useQuery({ queryKey: organizationKeys.detail(organizationId), queryFn: () => getOrganization(organizationId) });
