import type { Organization, OrganizationContact } from '@/domain/types';

export interface OrganizationSummary extends Organization {
  openDemands: number;
}

/** Demanda aberta no cardápio, só o que a página da organização lista. */
export interface OrganizationDemandRef {
  id: string;
  title: string;
}

/** Projeto do docente com a organização, só o que a página lista. */
export interface OrganizationProjectRef {
  id: string;
  title: string;
  semester: string;
  disciplineName: string;
}

export interface OrganizationDetail {
  organization: Organization;
  /** Só vem para quem já tem projeto com a organização (regra 6). */
  contact?: OrganizationContact;
  openDemands: OrganizationDemandRef[];
  myProjects: OrganizationProjectRef[];
}
