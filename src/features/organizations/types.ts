import type { Demand, Organization, OrganizationContact, Project } from '@/domain/types';

export interface OrganizationSummary extends Organization {
  openDemands: number;
}

export interface OrganizationDetail {
  organization: Organization;
  /** Só vem para quem já tem projeto com a organização (regra 4). */
  contact?: OrganizationContact;
  openDemands: Demand[];
  myProjects: Project[];
}
