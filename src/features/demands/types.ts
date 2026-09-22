import type { Demand, Organization } from '@/domain/types';

export interface DemandDetail {
  demand: Demand;
  organization: Organization;
  /** Presente quando a demanda já é um projeto do docente. */
  projectId?: string;
}
